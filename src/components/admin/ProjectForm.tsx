"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import { resizeImage } from "@/lib/image-utils";
import {
  getSafeExternalUrl,
  isSafeImageSource,
} from "@/lib/content-validation";
import type {
  Project,
  ProjectCategory,
  ProjectLink,
  ProjectLinkType,
  ProjectStatus,
} from "@/types";
import {
  PROJECT_CATEGORIES,
  PROJECT_LINK_TYPES,
  PROJECT_STATUSES,
} from "@/types";
import type { ProjectDraft } from "@/lib/content-store";

const inputClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted">
      {children}
    </label>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function emptyDraft(): ProjectDraft {
  return {
    title: "",
    slug: "",
    summary: "",
    description: "",
    category: [],
    status: "In Progress",
    year: new Date().getFullYear(),
    client: "",
    featured: false,
    tags: [],
    links: [],
    features: [],
    results: { role: "", duration: "", team: "", impact: "" },
  };
}

function projectToDraft(project: Project): ProjectDraft {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    category: project.category,
    status: project.status,
    year: project.year,
    client: project.client,
    featured: project.featured,
    tags: project.tags ?? [],
    links: project.links ?? [],
    images: project.images,
    results: project.results,
    features: project.features,
    challenges: project.challenges,
    solution: project.solution,
  };
}

interface ProjectFormProps {
  initial?: Project | null;
  onSubmit: (draft: ProjectDraft) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  initial,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [draft, setDraft] = useState<ProjectDraft>(() =>
    initial ? projectToDraft(initial) : emptyDraft(),
  );
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      const url = dataUrl;
      set("images", [{ id: crypto.randomUUID(), url, order: 0 }]);
    } catch {
      console.error("Could not read the selected image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const coverUrl = draft.images?.[0]?.url ?? "";

  const set = <K extends keyof ProjectDraft>(key: K, value: ProjectDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (category: ProjectCategory) => {
    setDraft((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const updateLink = (index: number, patch: Partial<ProjectLink>) => {
    setDraft((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    }));
  };

  const removeLink = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateResult = (patch: Partial<NonNullable<ProjectDraft["results"]>>) => {
    setDraft((prev) => ({
      ...prev,
      results: {
        role: prev.results?.role ?? "",
        duration: prev.results?.duration ?? "",
        team: prev.results?.team ?? "",
        impact: prev.results?.impact ?? "",
        ...patch,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const links = draft.links.filter((link) => link.url.trim());
    if (links.some((link) => !getSafeExternalUrl(link.url))) {
      setFormError("Links must use http:// or https://.");
      return;
    }
    if (coverUrl && !isSafeImageSource(coverUrl)) {
      setFormError("The card image must be an http(s) URL or an uploaded image.");
      return;
    }
    setFormError("");
    onSubmit({ ...draft, links });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Title">
          <input
            type="text"
            required
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Slug (URL)">
          <input
            type="text"
            value={draft.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="auto from title"
            className={inputClass}
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            value={draft.year}
            onChange={(e) => set("year", Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Summary (one line, shown in cards)">
        <textarea
          rows={2}
          value={draft.summary}
          onChange={(e) => set("summary", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Description (Markdown: ## titles, - lists)">
        <textarea
          rows={10}
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${inputClass} font-mono`}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Status">
          <select
            value={draft.status}
            onChange={(e) => set("status", e.target.value as ProjectStatus)}
            className={inputClass}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Client">
          <input
            type="text"
            value={draft.client}
            onChange={(e) => set("client", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Card photo">
          <div className="flex items-start gap-3">
            <div className="relative grid h-20 w-32 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-surface-hover">
            {isSafeImageSource(coverUrl) ? (
                <Image
                  src={coverUrl}
                  alt="Cover preview"
                  fill
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Processing…" : "Upload image"}
              </button>
              <input
                type="text"
                placeholder="Or paste an image URL"
                value={coverUrl}
                onChange={(e) =>
                  set("images", [
                    { id: "cover", url: e.target.value, order: 0 },
                  ])
                }
                className={inputClass}
              />
              <p className="text-xs text-muted">
                Uploaded images are stored locally in the browser.
              </p>
            </div>
          </div>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tags (comma separated)">
          <input
            type="text"
            value={draft.tags.join(", ")}
            onChange={(e) =>
              set(
                "tags",
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            className={inputClass}
          />
        </Field>
        <Field label="Features (one per line)">
          <textarea
            rows={3}
            value={draft.features?.join("\n") ?? ""}
            onChange={(e) =>
              set(
                "features",
                e.target.value
                  .split("\n")
                  .map((f) => f.trim())
                  .filter(Boolean),
              )
            }
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Categories">
        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`rounded-full px-3 py-1 text-sm transition ${
                draft.category.includes(category)
                  ? "bg-primary text-white"
                  : "border border-border text-muted hover:bg-surface-hover"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="rounded border-border"
        />
        Featured (shows on the Home page)
      </label>

      <div>
        <Label>Links</Label>
        <div className="space-y-2">
          {draft.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={link.type}
                onChange={(e) =>
                  updateLink(index, { type: e.target.value as ProjectLinkType })
                }
                className={`${inputClass} w-32`}
              >
                {PROJECT_LINK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(index, { url: e.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                aria-label="Remove link"
                className="p-2 text-muted hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setDraft((prev) => ({
              ...prev,
              links: [...prev.links, { type: "github", url: "" }],
            }))
          }
          className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <Plus className="h-4 w-4" />
          Add link
        </button>
      </div>

      <Field label="Challenges">
        <textarea
          rows={3}
          value={draft.challenges ?? ""}
          onChange={(e) => set("challenges", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Solution">
        <textarea
          rows={3}
          value={draft.solution ?? ""}
          onChange={(e) => set("solution", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Role">
          <input
            type="text"
            value={draft.results?.role ?? ""}
            onChange={(e) => updateResult({ role: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Duration">
          <input
            type="text"
            value={draft.results?.duration ?? ""}
            onChange={(e) => updateResult({ duration: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Team">
          <input
            type="text"
            value={draft.results?.team ?? ""}
            onChange={(e) => updateResult({ team: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Impact">
          <input
            type="text"
            value={draft.results?.impact ?? ""}
            onChange={(e) => updateResult({ impact: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}
      <div className="flex items-center justify-end gap-2 pt-2">
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
          {initial ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
