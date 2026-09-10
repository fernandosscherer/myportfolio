"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import {
  projects as seedProjects,
  experiences as seedExperiences,
  skillGroups as seedSkillGroups,
} from "@/lib/projects";
import { siteConfig } from "@/lib/config";
import type { Experience, ProfileData, Project, SkillGroup } from "@/types";

export interface PageCopy {
  title?: string;
  description?: string;
  headline?: string;
  bio?: string;
  cta?: string;
  custom?: boolean;
  slug?: string;
  showInNav?: boolean;
}

const DEFAULT_PROFILE: ProfileData = {
  name: siteConfig.name,
  initials: siteConfig.initials,
  role: siteConfig.role,
  headline: siteConfig.headline,
  location: siteConfig.location,
  availability: siteConfig.availability,
  email: siteConfig.email,
  phone: "",
  website: siteConfig.website,
  photo: "",
  calendly: siteConfig.calendly,
  responseTime: "within 24 hours",
  companyName: siteConfig.company.name,
  companyDescription: siteConfig.company.description,
  companyWebsite: siteConfig.company.website,
  socials: [
    { type: "github", url: siteConfig.github, label: "GitHub" },
    { type: "linkedin", url: siteConfig.linkedin, label: "LinkedIn" },
  ],
  indicators: [...siteConfig.indicators],
};

export interface PersistedContent {
  profile: ProfileData;
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
    profile: copy(DEFAULT_PROFILE),
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
    const parsed = JSON.parse(raw) as Partial<PersistedContent> | null;
    if (!parsed || typeof parsed !== "object") return cloneSeed();
    const base = cloneSeed();
    return {
      profile: {
        ...base.profile,
        ...(parsed.profile &&
        typeof parsed.profile === "object" &&
        !Array.isArray(parsed.profile)
          ? parsed.profile
          : {}),
      },
      projects: Array.isArray(parsed.projects) ? parsed.projects : base.projects,
      experiences: Array.isArray(parsed.experiences)
        ? parsed.experiences
        : base.experiences,
      skillGroups: Array.isArray(parsed.skillGroups)
        ? parsed.skillGroups
        : base.skillGroups,
      pages: parsed.pages && typeof parsed.pages === "object" && !Array.isArray(parsed.pages)
        ? parsed.pages
        : {},
    };
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

let state: PersistedContent = cloneSeed();
const serverSnapshot: PersistedContent = cloneSeed();
let hydrated = false;
const listeners = new Set<() => void>();

function getSnapshot(): PersistedContent {
  return state;
}

function getServerSnapshot(): PersistedContent {
  return serverSnapshot;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function applyState(next: PersistedContent) {
  state = next;
  listeners.forEach((listener) => listener());
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  applyState(loadPersisted());
}

interface ContentContextValue extends PersistedContent {
  updateProfile: (patch: Partial<ProfileData>) => void;
  addProject: (draft: ProjectDraft) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addExperience: (data: Omit<Experience, "id">) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  upsertSkillGroup: (skillGroup: SkillGroup) => void;
  deleteSkillGroup: (category: string) => void;
  addCustomPage: (label: string, slug: string) => void;
  updatePageCopy: (route: string, patch: PageCopy) => void;
  deletePageCopy: (route: string) => void;
  resetPageCopy: (route: string) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const content = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
      // storage unavailable or full — keep session state
    }
  }, [content]);

  const updateProfile = useCallback((patch: Partial<ProfileData>) => {
    applyState({ ...state, profile: { ...state.profile, ...patch } });
  }, []);

  const addCustomPage = useCallback((label: string, slug: string) => {
    const route = `/${slug}`;
    applyState({
      ...state,
      pages: {
        ...state.pages,
        [route]: { title: label, custom: true, slug, showInNav: true },
      },
    });
  }, []);

  const deletePageCopy = useCallback((route: string) => {
    const pages = { ...state.pages };
    delete pages[route];
    applyState({ ...state, pages });
  }, []);

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
    applyState({ ...state, projects: [...state.projects, project] });
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    const slug = patch.slug?.trim() || undefined;
    applyState({
      ...state,
      projects: state.projects.map((p) =>
        p.id === id
          ? {
              ...p,
              ...patch,
              slug: slug ?? p.slug,
              updated_at: new Date().toISOString(),
            }
          : p,
      ),
    });
  }, []);

  const deleteProject = useCallback((id: string) => {
    applyState({
      ...state,
      projects: state.projects.filter((p) => p.id !== id),
    });
  }, []);

  const addExperience = useCallback((data: Omit<Experience, "id">) => {
    const experience: Experience = { ...data, id: crypto.randomUUID() };
    applyState({ ...state, experiences: [...state.experiences, experience] });
  }, []);

  const updateExperience = useCallback(
    (id: string, patch: Partial<Experience>) => {
      applyState({
        ...state,
        experiences: state.experiences.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      });
    },
    [],
  );

  const deleteExperience = useCallback((id: string) => {
    applyState({
      ...state,
      experiences: state.experiences.filter((e) => e.id !== id),
    });
  }, []);

  const upsertSkillGroup = useCallback((skillGroup: SkillGroup) => {
    const exists = state.skillGroups.some(
      (g) => g.category === skillGroup.category,
    );
    applyState({
      ...state,
      skillGroups: exists
        ? state.skillGroups.map((g) =>
            g.category === skillGroup.category ? skillGroup : g,
          )
        : [...state.skillGroups, skillGroup],
    });
  }, []);

  const deleteSkillGroup = useCallback((category: string) => {
    applyState({
      ...state,
      skillGroups: state.skillGroups.filter((g) => g.category !== category),
    });
  }, []);

  const updatePageCopy = useCallback((route: string, patch: PageCopy) => {
    const current = state.pages[route] ?? {};
    const filtered: PageCopy = {};
    for (const [key, value] of Object.entries({ ...current, ...patch })) {
      if (value !== undefined && value !== "") {
        filtered[key as keyof PageCopy] = value as never;
      }
    }
    applyState({
      ...state,
      pages: { ...state.pages, [route]: filtered },
    });
  }, []);

  const resetPageCopy = useCallback((route: string) => {
    const pages = { ...state.pages };
    delete pages[route];
    applyState({ ...state, pages });
  }, []);

  const resetContent = useCallback(() => {
    applyState(cloneSeed());
  }, []);

  const value: ContentContextValue = {
    ...content,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    upsertSkillGroup,
    deleteSkillGroup,
    addCustomPage,
    updatePageCopy,
    deletePageCopy,
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