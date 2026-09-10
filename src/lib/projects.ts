import type { Project, Experience, SkillGroup } from "@/types";

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
//     status: "Completed",                // Completed | In Progress | Archived
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
//   }
export const projects: Project[] = [
  {
    id: "opera-trader",
    title: "Opera Trader",
    slug: "opera-trader",
    summary:
      "AI-powered trading platform designed to help traders and investors make faster, data-driven decisions through real-time dashboards, trading automation, and intelligent market analysis.",
    description: `## Overview

AI-powered trading platform designed to help traders and investors make faster, data-driven decisions through real-time dashboards, trading automation, and intelligent market analysis.

## Problem

Traders often rely on multiple disconnected tools for market monitoring, technical analysis, and trade execution, creating a fragmented workflow and increasing operational risk.

## Solution

Built a unified trading platform that centralizes market data, automation, analytics, and AI-powered decision support in a single interface.

## Development Lifecycle

- Product discovery and market research
- System architecture and feature planning
- UX/UI design focused on high-speed trading workflows
- Full-stack development of real-time dashboards
- Integration with financial market APIs and trading services
- Trading automation and alert system implementation
- Cloud deployment with performance optimization and security`,
    category: ["AI", "Dashboard", "SaaS"],
    status: "Completed",
    year: 2024,
    client: "Data Maple AI",
    featured: true,
    tags: [
      "PHP",
      "WordPress",
      "MySQL",
      "JavaScript",
      "Trading APIs",
      "Cloudflare",
      "Docker",
      "AI APIs",
    ],
    links: [
      { type: "github", url: "https://github.com/fernandosscherer/opera-trader", label: "Source" },
      { type: "website", url: "https://opera-trader.example.com", label: "Website" },
    ],
    images: [
      {
        id: "cover",
        url: "/projects/opera-trader.png",
        caption: "Opera Trader dashboard",
        order: 0,
      },
    ],
    results: {
      role: "Founder • Product Architect • Full Stack Developer",
      duration: "Ongoing",
      team: "Founder-led",
      impact:
        "A unified trading workflow with real-time dashboards, automation and AI-powered decision support.",
    },
    features: [
      "Real-time trading dashboards",
      "AI-powered market analysis",
      "Trading automation tools",
      "Smart Morning Call dashboard",
      "Technical indicators and trade management",
      "Alerts and decision-support engine",
    ],
    challenges:
      "Traders often rely on multiple disconnected tools for market monitoring, technical analysis, and trade execution, creating a fragmented workflow and increasing operational risk.",
    solution:
      "Built a unified trading platform that centralizes market data, automation, analytics, and AI-powered decision support in a single interface.",
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2025-06-01T00:00:00.000Z",
  },
  {
    id: "investing-social",
    title: "Investing Social",
    slug: "investing-social",
    summary:
      "AI-powered social investing platform combining investor communities, portfolio sharing, intelligent search, personalized recommendations, and financial insights.",
    description: `## Overview

AI-powered social investing platform combining investor communities, portfolio sharing, intelligent search, personalized recommendations, and financial insights.

## Problem

Investors consume information across multiple platforms, making it difficult to discover reliable insights, connect with other investors, and organize investment knowledge.

## Solution

Created a social investing ecosystem where users can share portfolios, discover financial content through AI search, and receive personalized recommendations based on their interests and investment behavior.

## Development Lifecycle

- Product strategy and SaaS planning
- Platform architecture and database design
- UX/UI design for social investing experiences
- Development of user profiles, feeds, and communities
- AI semantic search and recommendation engine integration
- Cloud deployment with scalable infrastructure`,
    category: ["AI", "SaaS"],
    status: "Completed",
    year: 2023,
    client: "Data Maple AI",
    featured: true,
    tags: [
      "PHP",
      "WordPress",
      "MySQL",
      "JavaScript",
      "AI APIs",
      "Vector Search",
      "REST APIs",
      "Cloudflare",
    ],
    links: [
      { type: "github", url: "https://github.com/fernandosscherer/investing-social", label: "Source" },
      { type: "website", url: "https://investing-social.example.com", label: "Website" },
    ],
    images: [
      {
        id: "cover",
        url: "/projects/investing-social.png",
        caption: "Investing Social platform",
        order: 0,
      },
    ],
    results: {
      role: "Founder • Product Architect • Full Stack Developer",
      duration: "Ongoing",
      team: "Founder-led",
      impact:
        "A social investing ecosystem with AI semantic search and personalized recommendations.",
    },
    features: [
      "Investor communities",
      "Public portfolio sharing",
      "AI semantic search",
      "Personalized financial recommendations",
      "Intelligent content feed",
      "Verified investor profiles (SkinBadge)",
    ],
    challenges:
      "Investors consume information across multiple platforms, making it difficult to discover reliable insights, connect with other investors, and organize investment knowledge.",
    solution:
      "Created a social investing ecosystem where users can share portfolios, discover financial content through AI search, and receive personalized recommendations based on their interests and investment behavior.",
    created_at: "2023-03-10T00:00:00.000Z",
    updated_at: "2025-06-01T00:00:00.000Z",
  },
  {
    id: "fundbridge",
    title: "FundBridge",
    slug: "fundbridge",
    summary:
      "AI-powered funding platform connecting startups, companies, universities, and organizations with grants, innovation programs, and funding opportunities.",
    description: `## Overview

AI-powered funding platform connecting startups, companies, universities, and organizations with grants, innovation programs, and funding opportunities.

## Problem

Finding grants and innovation funding requires manually searching dozens of government, university, and private funding portals with different rules, deadlines, and eligibility criteria.

## Solution

Developed an AI-powered platform that centralizes funding opportunities, automatically categorizes programs, and recommends the most relevant grants for each organization.

## Development Lifecycle

- Research of innovation and funding ecosystems
- Data modeling for grants and funding programs
- Search engine and advanced filtering system
- AI recommendation engine implementation
- Administrative dashboard for opportunity management
- Cloud deployment and infrastructure optimization`,
    category: ["AI", "SaaS", "Cloud"],
    status: "Completed",
    year: 2024,
    client: "Data Maple AI",
    featured: true,
    tags: [
      "PHP",
      "WordPress",
      "MySQL",
      "AI APIs",
      "NocoDB",
      "Docker",
      "Cloudflare",
    ],
    links: [
      { type: "github", url: "https://github.com/fernandosscherer/fundbridge", label: "Source" },
      { type: "website", url: "https://fundbridge.example.com", label: "Website" },
    ],
    images: [
      {
        id: "cover",
        url: "/projects/fundbridge.png",
        caption: "FundBridge platform",
        order: 0,
      },
    ],
    results: {
      role: "Founder • Product Architect • Full Stack Developer",
      duration: "Ongoing",
      team: "Founder-led",
      impact:
        "A centralized grants catalog with AI-powered search and personalized recommendations.",
    },
    features: [
      "Centralized grants catalog",
      "AI-powered funding search",
      "Personalized opportunity recommendations",
      "Deadline monitoring and alerts",
      "Startup and organization dashboards",
      "Innovation program management",
    ],
    challenges:
      "Finding grants and innovation funding requires manually searching dozens of government, university, and private funding portals with different rules, deadlines, and eligibility criteria.",
    solution:
      "Developed an AI-powered platform that centralizes funding opportunities, automatically categorizes programs, and recommends the most relevant grants for each organization.",
    created_at: "2024-05-20T00:00:00.000Z",
    updated_at: "2025-06-01T00:00:00.000Z",
  },
];

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
