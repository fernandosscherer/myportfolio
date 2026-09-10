import { Project, Experience, SkillGroup, ProjectCategory } from "@/types";

// Add your own projects here. Full field reference:
//
//   {
//     id: "1",
//     title: "My Project",
//     slug: "my-project",                 // used in the URL: /projects/my-project
//     summary: "One-line description shown in cards and search.",
//     description: "## Overview\n\nMarkdown-ish case study body.",
//     category: ["SaaS"],                 // from: AI, Automation, WordPress, SaaS,
//                                         //        Dashboard, API, Cloud, Design System
//     status: "Featured",                 // Featured | Completed | In Progress | Archived
//     year: 2024,
//     client: "Client name (optional)",
//     featured: true,                     // shows on the Home page
//     tags: ["Next.js", "Supabase"],
//     links: [{ type: "github", url: "https://…" }],       // github, website, demo, …
//     results: { role: "Lead Developer", duration: "3 months", team: "2 people", impact: "…" },
//     features: ["Feature one", "Feature two"],
//     challenges: "…",
//     solution: "…",
//     images: [{ id: "i1", url: "/cover.png", caption: "…", order: 0 }],
//     architecture: "/architecture.png",  // optional diagram
//   }
export const projects: Project[] = [];

// Work experience shown on /experience and /resume.
//   { period: "2023 — Present", title: "Founder", company: "Company", description: "…", current: true }
export const experiences: Experience[] = [];

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "WordPress",
      "Elementor",
      "WooCommerce",
    ],
  },
  {
    category: "Backend",
    skills: [
      "PHP",
      "Node.js",
      "Python",
      "Supabase",
      "MySQL",
      "PostgreSQL",
      "REST APIs",
      "GraphQL",
      "Redis",
    ],
  },
  {
    category: "AI",
    skills: [
      "OpenAI API",
      "Claude API",
      "Gemini",
      "MCP",
      "RAG",
      "AI Agents",
      "Prompt Engineering",
    ],
  },
  {
    category: "Cloud",
    skills: [
      "Docker",
      "Cloudflare",
      "Vercel",
      "AWS",
      "Linux",
      "Portainer",
      "NGINX",
      "Traefik",
    ],
  },
  {
    category: "Automation",
    skills: [
      "n8n",
      "Zapier",
      "Webhooks",
      "API Integrations",
      "Cron Jobs",
      "Workers",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((p) => p.category.includes(category));
}

export function searchProjects(query: string): Project[] {
  const q = query.toLowerCase();
  return projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.some((c) => c.toLowerCase().includes(q)) ||
      p.client.toLowerCase().includes(q)
  );
}