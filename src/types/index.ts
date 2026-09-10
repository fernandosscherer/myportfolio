export type ProjectCategory =
  | "AI"
  | "Automation"
  | "WordPress"
  | "SaaS"
  | "Dashboard"
  | "API"
  | "Cloud"
  | "Design System";

export type ProjectStatus = "Featured" | "Completed" | "In Progress" | "Archived";

export type ProjectLinkType =
  | "github"
  | "website"
  | "demo"
  | "youtube"
  | "vimeo"
  | "figma"
  | "behance";

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
  architecture?: string;
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

export interface Tag {
  id: string;
  name: string;
  color: string;
  category: string;
}

export const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  AI: "bg-cat-ai",
  Automation: "bg-cat-automation",
  WordPress: "bg-cat-wordpress",
  SaaS: "bg-cat-saas",
  Dashboard: "bg-cat-dashboard",
  API: "bg-cat-api",
  Cloud: "bg-cat-cloud",
  "Design System": "bg-cat-design",
};

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
