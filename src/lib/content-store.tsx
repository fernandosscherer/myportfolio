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
import {
  getCustomPageSlugError,
  getSafeExternalUrl,
  isSafeImageSource,
  normalizeSlug,
} from "@/lib/content-validation";
import {
  PROJECT_CATEGORIES,
  PROJECT_LINK_TYPES,
  PROJECT_STATUSES,
} from "@/types";
import type { Experience, ProfileData, Project, SkillGroup } from "@/types";

export interface PageCopy {
  title?: string;
  description?: string;
  headline?: string;
  bio?: string;
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

interface PageDefaults extends PageCopy {
  title: string;
  description: string;
}

export const PAGE_DEFAULTS: Record<string, PageDefaults> = {
  "/": {
    title: "Let's build something together",
    description:
      "I help startups and companies build high-quality websites, SaaS products, AI integrations and automation systems.",
  },
  "/projects": {
    title: "Projects",
    description: "All case studies and experiments",
  },
  "/experience": {
    title: "Experience",
    description:
      "By the time I had 4 years of experience, I felt I was just getting started. I’m on a mission to find new challenges and build incredible products.",
  },
  "/skills": {
    title: "Skills",
    description:
      "The technologies and tools I use to build production-ready products.",
  },
  "/resume": {
    title: "Resume",
    description: "A concise overview of my professional journey.",
  },
  "/about": {
    title: siteConfig.name,
    description: siteConfig.headline,
    bio: "With a focus on shipping, I lead projects end-to-end: architecture, interface, infrastructure and deployment.",
  },
  "/contact": {
    title: "Let’s talk",
    description:
      "I'm open to freelance projects, full-time roles and collaborations in AI, Web and Automation.",
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

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizePages(value: unknown): Record<string, PageCopy> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const pages: Record<string, PageCopy> = {};
  for (const [route, rawPage] of Object.entries(value)) {
    if (!rawPage || typeof rawPage !== "object") continue;
    const page = rawPage as PageCopy;
    if (!page.custom) {
      if (PAGE_DEFAULTS[route]) pages[route] = page;
      continue;
    }
    const slugBase = normalizeSlug(page.slug ?? route.slice(1));
    if (getCustomPageSlugError(slugBase, [])) continue;
    let slug = slugBase;
    let suffix = 2;
    while (pages[`/${slug}`]) {
      slug = `${slugBase}-${suffix}`;
      suffix += 1;
    }
    pages[`/${slug}`] = { ...page, slug };
  }
  return pages;
}

function loadPersisted(): PersistedContent {
  if (typeof window === "undefined") return cloneSeed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneSeed();
    const parsed = JSON.parse(raw) as Partial<PersistedContent> | null;
    if (!parsed || typeof parsed !== "object") return cloneSeed();
    const base = cloneSeed();
    const storedProfile: Partial<ProfileData> =
      parsed.profile &&
      typeof parsed.profile === "object" &&
      !Array.isArray(parsed.profile)
        ? parsed.profile
        : {};
    const profile: ProfileData = {
      ...base.profile,
      name: text(storedProfile.name, base.profile.name),
      initials: text(storedProfile.initials, base.profile.initials),
      role: text(storedProfile.role, base.profile.role),
      headline: text(storedProfile.headline, base.profile.headline),
      location: text(storedProfile.location, base.profile.location),
      availability: text(
        storedProfile.availability,
        base.profile.availability,
      ),
      email: text(storedProfile.email, base.profile.email),
      phone: text(storedProfile.phone),
      website:
        storedProfile.website === undefined
          ? base.profile.website
          : (getSafeExternalUrl(storedProfile.website) ?? ""),
      photo: isSafeImageSource(storedProfile.photo) ? storedProfile.photo : "",
      calendly: getSafeExternalUrl(storedProfile.calendly) ?? "",
      responseTime: text(storedProfile.responseTime, base.profile.responseTime),
      companyName: text(storedProfile.companyName),
      companyDescription: text(storedProfile.companyDescription),
      companyWebsite: getSafeExternalUrl(storedProfile.companyWebsite) ?? "",
      socials: Array.isArray(storedProfile.socials)
        ? storedProfile.socials.filter(
            (link) =>
              link &&
              PROJECT_LINK_TYPES.includes(link.type) &&
              typeof link.url === "string" &&
              getSafeExternalUrl(link.url),
          )
        : base.profile.socials,
      indicators: Array.isArray(storedProfile.indicators)
        ? storedProfile.indicators
            .filter((indicator) => indicator && typeof indicator === "object")
            .map((indicator) => ({
              value: text(indicator.value),
              label: text(indicator.label),
            }))
        : base.profile.indicators,
    };
    const usedProjectSlugs = new Set<string>();
    const projects = Array.isArray(parsed.projects)
      ? parsed.projects
          .filter((project) => project && typeof project === "object")
          .map((project, index) => {
            const title = text(project.title, `Untitled Project ${index + 1}`);
            const slugBase = normalizeSlug(text(project.slug, title)) || `project-${index + 1}`;
            let slug = slugBase;
            let suffix = 2;
            while (usedProjectSlugs.has(slug)) {
              slug = `${slugBase}-${suffix}`;
              suffix += 1;
            }
            usedProjectSlugs.add(slug);
            const legacyStatus = text(project.status);
            const status = PROJECT_STATUSES.includes(
              legacyStatus as Project["status"],
            )
              ? (legacyStatus as Project["status"])
              : "Completed";
            return {
              ...project,
              id: text(project.id, crypto.randomUUID()),
              title,
              slug,
              summary: text(project.summary),
              description: text(project.description),
              status,
              year:
                typeof project.year === "number" && Number.isFinite(project.year)
                  ? project.year
                  : new Date().getFullYear(),
              client: text(project.client),
              featured: Boolean(project.featured || legacyStatus === "Featured"),
              category: Array.isArray(project.category)
                ? project.category.filter((category) =>
                    PROJECT_CATEGORIES.includes(category),
                  )
                : [],
              tags: Array.isArray(project.tags)
                ? project.tags.filter((tag) => typeof tag === "string")
                : [],
              links: Array.isArray(project.links)
                ? project.links.filter(
                    (link) =>
                      link &&
                      PROJECT_LINK_TYPES.includes(link.type) &&
                      typeof link.url === "string" &&
                      getSafeExternalUrl(link.url),
                  )
                : [],
              images: Array.isArray(project.images)
                ? project.images.filter(
                    (image) =>
                      image &&
                      typeof image.url === "string" &&
                      isSafeImageSource(image.url),
                  )
                : [],
              created_at: text(project.created_at),
              updated_at: text(project.updated_at),
            };
          })
      : base.projects;
    return {
      profile,
      projects,
      experiences: Array.isArray(parsed.experiences)
        ? parsed.experiences
            .filter((experience) => experience && typeof experience === "object")
            .map((experience) => ({
              ...experience,
              id: text(experience.id, crypto.randomUUID()),
              period: text(experience.period),
              title: text(experience.title),
              company: text(experience.company),
              description: text(experience.description),
              current: Boolean(experience.current),
            }))
        : base.experiences,
      skillGroups: Array.isArray(parsed.skillGroups)
        ? parsed.skillGroups
            .filter((group) => group && typeof group === "object")
            .map((group) => ({
              ...group,
              category: text(group.category, "General"),
              skills: Array.isArray(group.skills)
                ? group.skills.filter((skill) => typeof skill === "string")
                : [],
            }))
        : base.skillGroups,
      pages: normalizePages(parsed.pages),
    };
  } catch {
    return cloneSeed();
  }
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

function applyState(next: PersistedContent, persist = hydrated): boolean {
  if (persist && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return false;
    }
  }
  state = next;
  listeners.forEach((listener) => listener());
  return true;
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  applyState(loadPersisted(), false);
}

function getUniqueProjectSlug(value: string, excludedId?: string): string {
  const base = normalizeSlug(value) || "project";
  let candidate = base;
  let suffix = 2;
  while (
    state.projects.some(
      (project) => project.id !== excludedId && project.slug === candidate,
    )
  ) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

interface ContentContextValue extends PersistedContent {
  updateProfile: (patch: Partial<ProfileData>) => boolean;
  addProject: (draft: ProjectDraft) => boolean;
  updateProject: (id: string, patch: Partial<Project>) => boolean;
  deleteProject: (id: string) => boolean;
  addExperience: (data: Omit<Experience, "id">) => boolean;
  updateExperience: (id: string, patch: Partial<Experience>) => boolean;
  deleteExperience: (id: string) => boolean;
  upsertSkillGroup: (skillGroup: SkillGroup, previousCategory?: string) => boolean;
  deleteSkillGroup: (category: string) => boolean;
  addCustomPage: (label: string, slug: string) => boolean;
  updatePageCopy: (route: string, patch: PageCopy) => boolean;
  deletePageCopy: (route: string) => boolean;
  resetPageCopy: (route: string) => boolean;
  resetContent: () => boolean;
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
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) applyState(loadPersisted(), false);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateProfile = useCallback((patch: Partial<ProfileData>) => {
    return applyState({ ...state, profile: { ...state.profile, ...patch } });
  }, []);

  const addCustomPage = useCallback((label: string, slug: string) => {
    const normalizedSlug = normalizeSlug(slug);
    if (getCustomPageSlugError(normalizedSlug, Object.keys(state.pages))) {
      return false;
    }
    const route = `/${normalizedSlug}`;
    return applyState({
      ...state,
      pages: {
        ...state.pages,
        [route]: {
          title: label,
          custom: true,
          slug: normalizedSlug,
          showInNav: true,
        },
      },
    });
  }, []);

  const deletePageCopy = useCallback((route: string) => {
    const pages = { ...state.pages };
    delete pages[route];
    return applyState({ ...state, pages });
  }, []);

  const addProject = useCallback((draft: ProjectDraft) => {
    const now = new Date().toISOString();
    const slug = getUniqueProjectSlug(draft.slug || draft.title);
    const project: Project = {
      ...draft,
      id: crypto.randomUUID(),
      slug,
      created_at: now,
      updated_at: now,
    };
    return applyState({ ...state, projects: [...state.projects, project] });
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    const slug = patch.slug
      ? getUniqueProjectSlug(patch.slug, id)
      : undefined;
    return applyState({
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
    return applyState({
      ...state,
      projects: state.projects.filter((p) => p.id !== id),
    });
  }, []);

  const addExperience = useCallback((data: Omit<Experience, "id">) => {
    const experience: Experience = { ...data, id: crypto.randomUUID() };
    return applyState({
      ...state,
      experiences: [...state.experiences, experience],
    });
  }, []);

  const updateExperience = useCallback(
    (id: string, patch: Partial<Experience>) => {
      return applyState({
        ...state,
        experiences: state.experiences.map((e) =>
          e.id === id ? { ...e, ...patch } : e,
        ),
      });
    },
    [],
  );

  const deleteExperience = useCallback((id: string) => {
    return applyState({
      ...state,
      experiences: state.experiences.filter((e) => e.id !== id),
    });
  }, []);

  const upsertSkillGroup = useCallback((
    skillGroup: SkillGroup,
    previousCategory?: string,
  ) => {
    if (previousCategory) {
      const duplicateCategory = state.skillGroups.some(
        (group) =>
          group.category === skillGroup.category &&
          group.category !== previousCategory,
      );
      if (duplicateCategory) return false;
      return applyState({
        ...state,
        skillGroups: state.skillGroups.map((group) =>
          group.category === previousCategory ? skillGroup : group,
        ),
      });
    }
    const exists = state.skillGroups.some(
      (g) => g.category === skillGroup.category,
    );
    return applyState({
      ...state,
      skillGroups: exists
        ? state.skillGroups.map((g) =>
            g.category === skillGroup.category ? skillGroup : g,
          )
        : [...state.skillGroups, skillGroup],
    });
  }, []);

  const deleteSkillGroup = useCallback((category: string) => {
    return applyState({
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
    return applyState({
      ...state,
      pages: { ...state.pages, [route]: filtered },
    });
  }, []);

  const resetPageCopy = useCallback((route: string) => {
    const pages = { ...state.pages };
    delete pages[route];
    return applyState({ ...state, pages });
  }, []);

  const resetContent = useCallback(() => {
    return applyState(cloneSeed());
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
