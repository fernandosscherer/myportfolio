# myportfolio

A dark-first, open-source developer portfolio template. Case-study project
pages, command palette search, CMS-ready (Supabase), and a design language
inspired by GitHub, Vercel, Linear and Raycast.

Built with Next.js (App Router), React 19, TailwindCSS v4, TypeScript and
Framer Motion. MIT licensed — fork it, add your content, and ship.

## Features

- **Home** — hero + featured projects
- **Projects** — GitHub-style list with instant search and filters
- **Project pages** — full case-study structure (overview, tech stack,
  features, challenges/solution, results, gallery)
- **⌘K command palette** — search projects and technologies
- **Dark/light mode** — persisted, dark-first design system
- **SEO** — metadata, Open Graph, sitemap, robots, RSS-ready
- **CMS-ready** — Supabase schema included (`supabase/schema.sql`)
- **Experience / Skills / Resume / About / Contact** pages
- **Admin** — login-gated dashboard scaffold (PT-BR)

## Quick start

```bash
npm install
cp .env.example .env.local   # add your Supabase keys (optional
npm run dev                  # for the CMS admin)
```

Open http://localhost:3000.

## Add your content

| What              | Where                                    |
| ----------------- | ---------------------------------------- |
| Name, links, bio  | `src/lib/config.ts`                      |
| Projects          | `src/lib/projects.ts` (see field docs)   |
| Experience        | `src/lib/projects.ts` (`experiences`)    |
| Skills            | `src/lib/projects.ts` (`skillGroups`)    |
| Resume PDF        | `public/resume.pdf`                      |
| OG image (1200×630) | `public/og-image.png`                  |

## Database

Run `supabase/schema.sql` in the Supabase SQL Editor to create
`projects`, `tags`, `project_tags`, `project_images` and `links` with RLS.

## Commands

```bash
npm run dev      # development
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## License

MIT — see [LICENSE](LICENSE). Built and maintained by
[fernandosscherer](https://github.com/fernandosscherer).