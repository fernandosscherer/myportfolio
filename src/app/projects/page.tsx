"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, ArrowUpDown, ArrowRight, FolderGit2 } from "lucide-react"
import { projects } from "@/lib/projects"
import type { ProjectCategory } from "@/types"

const categories: (ProjectCategory | "All")[] = [
  "All",
  "AI",
  "Automation",
  "WordPress",
  "SaaS",
  "Dashboard",
  "API",
  "Cloud",
  "Design System",
]

const statuses = ["All", "Featured", "Completed", "In Progress", "Archived"] as const

export default function ProjectsPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ProjectCategory | "All">("All")
  const [year, setYear] = useState<string>("All")
  const [status, setStatus] = useState<string>("All")

  const years = useMemo(() => {
    const set = new Set<string>()
    for (const p of projects) {
      if (p.year) set.add(String(p.year))
    }
    return ["All", ...Array.from(set).sort((a, b) => Number(b) - Number(a))]
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()

    return projects.filter((p) => {
      if (q) {
        const haystack = [
          p.title,
          p.summary,
          p.client,
          p.category.join(" "),
          ...(p.tags ?? []),
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      if (category !== "All" && !p.category.includes(category)) return false
      if (year !== "All" && String(p.year) !== year) return false
      if (status !== "All" && p.status !== status) return false

      return true
    })
  }, [query, category, year, status])

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted mt-1">All case studies and experiments</p>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          placeholder="Search projects, technologies, clients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 w-full max-w-md text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-sm transition ${
              category === c
                ? "bg-primary text-white"
                : "border border-border text-muted hover:bg-surface-hover"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted" />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y === "All" ? "All years" : y}
              </option>
            ))}
          </select>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-0">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-muted text-sm">
            No projects found
          </div>
        ) : (
          filtered.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex items-center gap-4 px-4 py-3 border border-border -mt-px first:rounded-t-lg last:rounded-b-lg hover:bg-surface-hover transition"
            >
              <div className="h-10 w-10 rounded-md bg-surface-hover flex items-center justify-center shrink-0">
                <FolderGit2 className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">{project.title}</span>
                <p className="text-sm text-muted line-clamp-1">{project.summary}</p>
              </div>

              <span className="text-xs font-mono text-muted hidden md:block">
                {project.category.join(", ")}
              </span>

              <span className="text-xs font-mono text-muted">{project.year}</span>

              <ArrowRight className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-sm text-muted">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </main>
  )
}
