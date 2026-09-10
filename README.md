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
- **Admin** — browser-local content editor for previewing portfolio changes

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add your content

| What              | Where                                    |
| ----------------- | ---------------------------------------- |
| Name, links, bio  | `/admin` Profile tab or `src/lib/config.ts` |
| Projects          | `/admin` Projects tab                    |
| Experience        | `/admin` Experiences tab                 |
| Skills            | `/admin` Skills tab                      |
| Resume PDF        | `public/resume.pdf`                      |
| OG image (1200×630) | `public/og-image.png`                  |

## Database

Run `supabase/schema.sql` in the Supabase SQL Editor to create
the optional `projects` table with read-only RLS. Links, tags and images use
the JSON fields already present on each project instead of duplicate tables.
The application currently stores admin edits only in the current browser's
localStorage. The schema intentionally provides no write policy; add
owner-scoped authorization before connecting a shared CMS.
Older installations may still contain the former relation tables. The schema
revokes their permissive write policies but intentionally does not drop data;
remove those tables manually after confirming they are unused.

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
