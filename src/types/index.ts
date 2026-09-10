export const PROJECT_CATEGORIES = [
  "AI",
  "Automation",
  "WordPress",
  "SaaS",
  "Dashboard",
  "API",
  "Cloud",
  "Design System",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES = ["Completed", "In Progress", "Archived"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_LINK_TYPES = [
  "github",
  "website",
  "demo",
  "youtube",
  "vimeo",
  "figma",
  "behance",
  "instagram",
  "facebook",
  "linkedin",
  "x",
  "outros",
] as const;

export type ProjectLinkType = (typeof PROJECT_LINK_TYPES)[number];

export const PROFILE_LINK_TYPES = [
  "github",
  "website",
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "outros",
] as const satisfies readonly ProjectLinkType[];

export interface ProjectLink {
  type: ProjectLinkType;
  url: string;
  label?: string;
}

export interface ProjectResult {
  role: string;
  duration: string;
  team: string;
  impact: string;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: ProjectCategory[];
  status: ProjectStatus;
  year: number;
  client: string;
  featured: boolean;
  tags: string[];
  links: ProjectLink[];
  results?: ProjectResult;
  images?: ProjectImage[];
  features?: string[];
  challenges?: string;
  solution?: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  period: string;
  title: string;
  company: string;
  description: string;
  current?: boolean;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Indicator {
  value: string;
  label: string;
}

export interface ProfileLink {
  type: ProjectLinkType;
  url: string;
  label?: string;
}

export interface ProfileData {
  name: string;
  initials: string;
  role: string;
  headline: string;
  location: string;
  availability: string;
  email: string;
  phone?: string;
  website: string;
  photo?: string;
  calendly?: string;
  responseTime?: string;
  companyName?: string;
  companyDescription?: string;
  companyWebsite?: string;
  socials: ProfileLink[];
  indicators: Indicator[];
}

export const CATEGORY_TEXT_COLORS: Record<ProjectCategory, string> = {
  AI: "text-cat-ai",
  Automation: "text-cat-automation",
  WordPress: "text-cat-wordpress",
  SaaS: "text-cat-saas",
  Dashboard: "text-cat-dashboard",
  API: "text-cat-api",
  Cloud: "text-cat-cloud",
  "Design System": "text-cat-design",
};
