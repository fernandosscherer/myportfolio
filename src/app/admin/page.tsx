"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FolderGit2,
  Tags,
  ImageIcon,
  BarChart3,
  LogOut,
  Lock,
  Pencil,
  Copy,
  Archive,
} from "lucide-react"
import { projects } from "@/lib/projects"
import type { Project } from "@/types"

type Section = "dashboard" | "projects" | "tags" | "uploads" | "analytics"

const sections: { key: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "tags", label: "Tags", icon: Tags },
  { key: "uploads", label: "Uploads", icon: ImageIcon },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
]

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>("projects")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const allTags = [...new Set(projects.flatMap((p) => (p as Project).tags ?? []))]

  const stats = [
    { icon: FolderGit2, value: projects.length, label: "Projects" },
    { icon: Tags, value: allTags.length, label: "Tags" },
    { icon: ImageIcon, value: 0, label: "Images" },
    { icon: BarChart3, value: "—", label: "Analytics" },
  ]

  if (!isAuthed) {
    return (
      <div className="container max-w-[980px] mx-auto px-4 md:px-6 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="rounded-xl border border-border bg-surface p-8 max-w-sm mx-auto w-full">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted" />
          </div>
          <h1 className="text-xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-sm text-muted text-center mb-6">
            Sign in with Supabase to manage content
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setIsAuthed(true)
            }}
            className="space-y-3"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 w-full text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-2 w-full text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary text-white px-4 py-2 text-sm font-medium hover:bg-primary-hover w-full"
            >
              Sign In
            </button>
          </form>
          <p className="text-xs text-muted text-center mt-4">
            Supabase auth integration pending. Login is temporary.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-[980px] mx-auto px-4 md:px-6 py-16">
      <nav className="flex items-center gap-1 mb-8 flex-wrap">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeSection === s.key
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          )
        })}
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted mt-1">Manage projects, tags and content</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-lg border border-border bg-surface p-4">
              <Icon className="h-4 w-4 text-primary mb-2" />
              <div className="text-2xl font-mono font-bold">{stat.value}</div>
              <div className="text-xs text-muted mt-0.5">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {activeSection === "projects" && (
        <div className="rounded-lg border border-border overflow-hidden">
          {projects.map((project) => {
            const p = project as Project
            return (
              <div
                key={p.slug}
                className="flex items-center justify-between px-4 py-3 border border-border -mt-px hover:bg-surface-hover"
              >
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="font-mono text-xs text-muted">{p.slug}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-surface-hover border border-border">
                    {(p as Project & { status?: string }).status ?? "draft"}
                  </span>
                  <span className="font-mono text-xs text-muted">{p.year}</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-muted hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 text-muted hover:text-foreground transition-colors">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1 text-muted hover:text-foreground transition-colors">
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeSection !== "projects" && (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
          {sections.find((s) => s.key === activeSection)?.label} — em breve
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => setIsAuthed(false)}
          className="text-xs text-muted hover:text-foreground inline-flex items-center gap-1.5"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
