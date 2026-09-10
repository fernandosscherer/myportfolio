"use client";

import { useState } from "react";
import {
  Briefcase,
  Code2,
  FileText,
  FolderGit2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useContent } from "@/lib/content-store";
import type { ProjectDraft } from "@/lib/content-store";
import type { Experience, Project, SkillGroup } from "@/types";
import ProjectForm from "@/components/admin/ProjectForm";
import ExperienceForm from "@/components/admin/ExperienceForm";
import ProfileTab from "@/components/admin/ProfileTab";
import PagesTab from "@/components/admin/PagesTab";

type Tab = "profile" | "projects" | "experiences" | "skills" | "pages";

type EditorState =
  | { kind: "project"; project?: Project }
  | { kind: "experience"; experience?: Experience }
  | { kind: "skill"; index?: number }
  | null;

const inputClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30";

const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "experiences", label: "Experiences", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Code2 },
  { key: "pages", label: "Pages", icon: FileText },
];

function panel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 text-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}

function SkillForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: SkillGroup;
  onSubmit: (group: SkillGroup) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState(initial?.category ?? "");
  const [skillsText, setSkillsText] = useState(initial?.skills.join("\n") ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      category: category.trim() || "General",
      skills: skillsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Category
        </label>
        <input
          type="text"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Frontend"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Skills (one per line)
        </label>
        <textarea
          rows={6}
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          placeholder={"React\nNext.js\nTypeScript"}
          className={`${inputClass} font-mono`}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          {initial ? "Save" : "Add group"}
        </button>
      </div>
    </form>
  );
}

export default function AdminPage() {
  const {
    projects,
    experiences,
    skillGroups,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    upsertSkillGroup,
    deleteSkillGroup,
    resetContent,
  } = useContent();

  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [editor, setEditor] = useState<EditorState>(null);
  const [saveError, setSaveError] = useState("");

  const handleProjectSubmit = (draft: ProjectDraft) => {
    if (editor?.kind === "project" && editor.project) {
      if (!updateProject(editor.project.id, draft)) {
        setSaveError("Browser storage is full or unavailable.");
        return;
      }
    } else {
      if (!addProject(draft)) {
        setSaveError("Browser storage is full or unavailable.");
        return;
      }
    }
    setSaveError("");
    setEditor(null);
  };

  const handleExperienceSubmit = (data: Omit<Experience, "id">) => {
    if (editor?.kind === "experience" && editor.experience) {
      if (!updateExperience(editor.experience.id, data)) {
        setSaveError("Browser storage is full or unavailable.");
        return;
      }
    } else {
      if (!addExperience(data)) {
        setSaveError("Browser storage is full or unavailable.");
        return;
      }
    }
    setSaveError("");
    setEditor(null);
  };

  return (
    <div className="max-w-[980px] mx-auto px-4 md:px-6 py-16">
      <header className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <p className="font-mono text-sm text-primary">Admin</p>
          <h1 className="text-3xl font-bold mt-1">Content Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Create, edit and organize all the content of your portfolio.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all content to the default seed?")) {
              if (!resetContent()) {
                setSaveError("Browser storage is full or unavailable.");
                return;
              }
              setSaveError("");
              setEditor(null);
            }
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to seed
        </button>
      </header>

      <div className="mb-4 rounded-lg border border-dashed border-border p-3 text-xs text-muted">
        Changes are saved in your browser (localStorage) and update the public
        pages instantly.
      </div>

      {saveError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {saveError}
        </p>
      )}

      <nav className="flex items-center gap-1 mb-8 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setEditor(null);
                setSaveError("");
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {activeTab === "profile" && <ProfileTab />}

      {activeTab === "projects" && (
        <div>
          {editor?.kind === "project" ? (
            panel({
              title: editor.project ? "Edit project" : "New project",
              onClose: () => setEditor(null),
              children: (
                <ProjectForm
                  key={editor.project?.id ?? "new-project"}
                  initial={editor.project ?? null}
                  onSubmit={handleProjectSubmit}
                  onCancel={() => setEditor(null)}
                />
              ),
            })
          ) : (
            <button
              type="button"
              onClick={() => setEditor({ kind: "project" })}
              className="mb-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              New project
            </button>
          )}

          <div className="rounded-lg border border-border overflow-hidden">
            {projects.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">
                No projects yet.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 border border-border -mt-px hover:bg-surface-hover"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {project.title}
                    </div>
                    <div className="font-mono text-xs text-muted truncate">
                      /projects/{project.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-surface-hover border border-border hidden md:inline">
                      {project.status}
                    </span>
                    <span className="font-mono text-xs text-muted hidden md:inline">
                      {project.year}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditor({ kind: "project", project })}
                        aria-label={`Edit ${project.title}`}
                        className="p-1 text-muted hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${project.title}"?`)) {
                            if (!deleteProject(project.id)) {
                              setSaveError("Browser storage is full or unavailable.");
                            }
                          }
                        }}
                        aria-label={`Delete ${project.title}`}
                        className="p-1 text-muted hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "experiences" && (
        <div>
          {editor?.kind === "experience" ? (
            panel({
              title: editor.experience ? "Edit experience" : "New experience",
              onClose: () => setEditor(null),
              children: (
                <ExperienceForm
                  key={editor.experience?.id ?? "new-experience"}
                  initial={editor.experience ?? null}
                  onSubmit={handleExperienceSubmit}
                  onCancel={() => setEditor(null)}
                />
              ),
            })
          ) : (
            <button
              type="button"
              onClick={() => setEditor({ kind: "experience" })}
              className="mb-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              New experience
            </button>
          )}

          <div className="rounded-lg border border-border overflow-hidden">
            {experiences.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted">
                No experiences yet.
              </div>
            ) : (
              experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 border border-border -mt-px hover:bg-surface-hover"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {experience.title}
                      <span className="text-muted"> · {experience.company}</span>
                    </div>
                    <div className="font-mono text-xs text-muted truncate">
                      {experience.period}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setEditor({ kind: "experience", experience })
                      }
                      aria-label={`Edit ${experience.title}`}
                      className="p-1 text-muted hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${experience.title}"?`)) {
                          if (!deleteExperience(experience.id)) {
                            setSaveError("Browser storage is full or unavailable.");
                          }
                        }
                      }}
                      aria-label={`Delete ${experience.title}`}
                      className="p-1 text-muted hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div>
          {editor?.kind === "skill" ? (
            panel({
              title:
                editor.index !== undefined ? "Edit skill group" : "New skill group",
              onClose: () => setEditor(null),
              children: (
                <SkillForm
                  key={editor.index ?? "new-skill"}
                  initial={
                    editor.index !== undefined
                      ? skillGroups[editor.index]
                      : undefined
                  }
                  onSubmit={(group) => {
                    const duplicateCategory = skillGroups.some(
                      (existingGroup, index) =>
                        existingGroup.category === group.category &&
                        index !== editor.index,
                    );
                    if (duplicateCategory) {
                      setSaveError(
                        "A skill group with this category already exists.",
                      );
                      return;
                    }
                    const saved = upsertSkillGroup(
                      group,
                      editor.index !== undefined
                        ? skillGroups[editor.index].category
                        : undefined,
                    );
                    if (!saved) {
                      setSaveError("Browser storage is full or unavailable.");
                      return;
                    }
                    setSaveError("");
                    setEditor(null);
                  }}
                  onCancel={() => setEditor(null)}
                />
              ),
            })
          ) : (
            <button
              type="button"
              onClick={() => setEditor({ kind: "skill" })}
              className="mb-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              New skill group
            </button>
          )}

          {skillGroups.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted rounded-lg border border-dashed border-border">
              No skill groups yet.
            </div>
          ) : (
            <div className="space-y-4">
              {skillGroups.map((group, index) => (
                <div
                  key={group.category}
                  className="rounded-lg border border-border bg-surface p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{group.category}</h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditor({ kind: "skill", index })}
                        aria-label={`Edit ${group.category}`}
                        className="p-1 text-muted hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${group.category}"?`)) {
                            if (!deleteSkillGroup(group.category)) {
                              setSaveError("Browser storage is full or unavailable.");
                            }
                          }
                        }}
                        aria-label={`Delete ${group.category}`}
                        className="p-1 text-muted hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full border border-border bg-surface-hover font-mono text-xs text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "pages" && <PagesTab />}
    </div>
  );
}
