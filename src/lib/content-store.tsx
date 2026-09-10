"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import {
  projects as seedProjects,
  experiences as seedExperiences,
  skillGroups as seedSkillGroups,
} from "@/lib/projects";
import type { Experience, Project, SkillGroup } from "@/types";

export interface PageCopy {
  title?: string;
  description?: string;
  headline?: string;
  bio?: string;
  cta?: string;
}

export interface PersistedContent {
  projects: Project[];
  experiences: Experience[];
  skillGroups: SkillGroup[];
  pages: Record<string, PageCopy>;
}

export type ProjectDraft = Omit<Project, "id" | "created_at" | "updated_at">;

const STORAGE_KEY = "myportfolio:content:v1";

export const PAGE_ROUTES = [
  { route: "/", label: "Home" },
  { route: "/projects", label: "Projects" },
  { route: "/experience", label: "Experience" },
  { route: "/skills", label: "Skills" },
  { route: "/resume", label: "Resume" },
  { route: "/about", label: "About" },
  { route: "/contact", label: "Contact" },
] as const;

export const PAGE_DEFAULTS: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Home",
    description:
      "Once I have a clear picture of what you need, I start by understanding the problem and sketching the first version of the solution.",
  },
  "/projects": {
    title: "Selected Projects",
    description: "All case studies and experiments I’ve been working on.",
  },
  "/experience": {
    title: "Experience",
    description:
      "By the time I had 4 years of experience, I felt I was just getting started. I’m on a mission to find new challenges and build incredible products.",
  },
  "/skills": {
    title: "Toolbox",
    description:
      "The tools, languages and frameworks I use every day to build and ship.",
  },
  "/resume": {
    title: "Resume",
    description:
      "My experience in one page — download it and let’s talk if it’s a match.",
  },
  "/about": {
    title: "About",
    description:
      "I’m a Senior Web Designer, WordPress Engineer and AI Automation specialist with over 20 years of experience. I build websites, SaaS products, AI agents and automation systems for startups and businesses.",
  },
  "/contact": {
    title: "Let’s talk",
    description:
      "If you have a project in mind, or just want to say hi, drop me a line.",
  },
};

function cloneSeed(): PersistedContent {
  const copy = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
  return {
    projects: copy(seedProjects),
    experiences: copy(seedExperiences),
    skillGroups: copy(seedSkillGroups),
    pages: {},
  };
}

function loadPersisted(): PersistedContent {
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneSeed();
    const parsed = JSON.parse(raw) as PersistedContent;
    if (
      !Array.isArray(parsed.projects) ||
      !Array.isArray(parsed.experiences) ||
      !Array.isArray(parsed.skillGroups) ||
      typeof parsed.pages !== "object" ||
      parsed.pages === null
    ) {
      return cloneSeed();
    }
    return parsed;
  } catch {
    return cloneSeed();
  }
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ContentContextValue extends PersistedContent {
  addProject: (draft: ProjectDraft) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addExperience: (data: Omit<Experience, "id">) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  upsertSkillGroup: (skillGroup: SkillGroup) => void;
  deleteSkillGroup: (category: string) => void;
  updatePageCopy: (route: string, patch: PageCopy) => void;
  resetPageCopy: (route: string) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PersistedContent>(loadPersisted);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // storage unavailable — keep session state
    }
  }, [content]);

  const addProject = useCallback((draft: ProjectDraft) => {
    const now = new Date().toISOString();
    const slug = draft.slug.trim() || slugify(draft.title);
    const project: Project = {
      ...draft,
      id: crypto.randomUUID(),
      slug,
      created_at: now,
      updated_at: now,
    };
    setContent((prev) => ({ ...prev, projects: [...prev.projects, project] }));
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setContent((prev) => {
      const slug = patch.slug?.trim() || undefined;
      return {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                ...patch,
                slug: slug ?? p.slug,
                updated_at: new Date().toISOString(),
              }
            : p,
        ),
      };
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  const addExperience = useCallback((data: Omit<Experience, "id">) => {
    const experience: Experience = { ...data, id: crypto.randomUUID() };
    setContent((prev) => ({
      ...prev,
      experiences: [...prev.experiences, experience],
    }));
  }, []);

  const updateExperience = useCallback(
    (id: string, patch: Partial<Experience>) => {
      setContent((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      }));
    },
    [],
  );

  const deleteExperience = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

  const upsertSkillGroup = useCallback((skillGroup: SkillGroup) => {
    setContent((prev) => {
      const exists = prev.skillGroups.some(
        (g) => g.category === skillGroup.category,
      );
      return {
        ...prev,
        skillGroups: exists
          ? prev.skillGroups.map((g) =>
              g.category === skillGroup.category ? skillGroup : g,
            )
          : [...prev.skillGroups, skillGroup],
      };
    });
  }, []);

  const deleteSkillGroup = useCallback((category: string) => {
    setContent((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.filter((g) => g.category !== category),
    }));
  }, []);

  const updatePageCopy = useCallback((route: string, patch: PageCopy) => {
    setContent((prev) => {
      const current = prev.pages[route] ?? {};
      const filtered: PageCopy = {};
      for (const [key, value] of Object.entries({ ...current, ...patch })) {
        if (value !== undefined && value !== "") filtered[key as keyof PageCopy] = value as never;
      }
      return {
        ...prev,
        pages: { ...prev.pages, [route]: filtered },
      };
    });
  }, []);

  const resetPageCopy = useCallback((route: string) => {
    setContent((prev) => {
      const pages = { ...prev.pages };
      delete pages[route];
      return { ...prev, pages };
    });
  }, []);

  const resetContent = useCallback(() => {
    setContent(cloneSeed());
  }, []);

  const value: ContentContextValue = {
    ...content,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    upsertSkillGroup,
    deleteSkillGroup,
    updatePageCopy,
    resetPageCopy,
    resetContent,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}