"use client";

import { useState } from "react";
import { FileText, Pencil, Plus, Trash2, Undo2, X } from "lucide-react";
import {
  PAGE_DEFAULTS,
  PAGE_ROUTES,
  useContent,
} from "@/lib/content-store";
import type { PageCopy } from "@/lib/content-store";
import { siteConfig } from "@/lib/config";

interface FieldConfig {
  key: keyof PageCopy;
  label: string;
  textarea?: boolean;
}

const COMMON_FIELDS: FieldConfig[] = [
  { key: "title", label: "Heading" },
  { key: "description", label: "Subtitle", textarea: true },
];

const SPECIAL_FIELDS: Record<string, FieldConfig[]> = {
  "/": [
    { key: "headline", label: "Hero bio", textarea: true },
    { key: "title", label: "CTA heading" },
    { key: "description", label: "CTA text", textarea: true },
  ],
  "/about": [
    { key: "title", label: "Heading" },
    { key: "description", label: "First paragraph", textarea: true },
    { key: "bio", label: "Second paragraph", textarea: true },
  ],
  "/resume": [
    { key: "title", label: "Heading" },
    { key: "description", label: "Subtitle", textarea: true },
    { key: "bio", label: "Summary", textarea: true },
  ],
};

function fallback(route: string, field: keyof PageCopy): string {
  const page = PAGE_DEFAULTS[route];
  if (!page) return "";
  if (field === "headline") return siteConfig.headline;
  if (route === "/about" && field === "bio")
    return "With a focus on shipping, I lead projects end-to-end: architecture, interface, infrastructure and deployment.";
  if (route === "/resume" && field === "bio") return siteConfig.headline;
  if (field === "title") return page.title;
  if (field === "bio") return "";
  return page.description;
}

export default function PagesTab() {
  const { pages, deletePageCopy } = useContent();
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [showNewPage, setShowNewPage] = useState(false);

  const customPages = Object.entries(pages)
    .filter(([, v]) => v.custom)
    .map(([route, v]) => ({ route, ...v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">Standard pages and custom pages you create.</p>
        <button
          type="button"
          onClick={() => setShowNewPage(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New page
        </button>
      </div>

      {showNewPage && (
        <NewPageForm
          onAdd={() => setShowNewPage(false)}
          onCancel={() => setShowNewPage(false)}
        />
      )}

      <div className="space-y-3">
        {PAGE_ROUTES.map(({ route, label }) => {
          const edited = Object.keys(pages[route] ?? {}).length > 0;
          return (
            <div
              key={route}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted" />
                  <span className="font-medium">{label}</span>
                  {edited && (
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] text-primary">
                      edited
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-muted">{route}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingRoute(route)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>
          );
        })}

        {customPages.map(({ route, title }) => (
          <div
            key={route}
            className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">{title}</span>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] text-primary">
                  custom
                </span>
              </div>
              <span className="font-mono text-xs text-muted">{route}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEditingRoute(route)}
                className="p-2 text-muted hover:text-foreground transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete custom page "${title}"?`)) {
                    deletePageCopy(route);
                  }
                }}
                className="p-2 text-muted hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingRoute && (
        <div className="rounded-xl border border-border bg-surface p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">
              Edit {pages[editingRoute]?.title ?? editingRoute}
              <span className="font-mono text-xs text-muted ml-2">{editingRoute}</span>
            </h2>
            <button type="button" onClick={() => setEditingRoute(null)} className="p-1 text-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <PageForm route={editingRoute} onDone={() => setEditingRoute(null)} />
        </div>
      )}
    </div>
  );
}

function NewPageForm({ onAdd, onCancel }: { onAdd: () => void; onCancel: () => void }) {
  const { addCustomPage } = useContent();
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");

  const autoSlug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const effectiveSlug = slug || autoSlug;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !effectiveSlug) return;
    addCustomPage(label.trim(), effectiveSlug);
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5 mb-5 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Page label</label>
          <input type="text" required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="My Custom Page" className="rounded-md border border-border bg-background px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">URL slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={autoSlug || "auto-from-label"} className="rounded-md border border-border bg-background px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30" />
          <p className="text-xs text-muted mt-1">Route: /{effectiveSlug || "..."}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-hover">Cancel</button>
        <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-hover">Create page</button>
      </div>
    </form>
  );
}

function PageForm({ route, onDone }: { route: string; onDone: () => void }) {
  const { pages, updatePageCopy, resetPageCopy } = useContent();
  const isCustom = !!pages[route]?.custom;
  const fields = SPECIAL_FIELDS[route] ?? COMMON_FIELDS;
  const [draft, setDraft] = useState<PageCopy>(() => {
    const current = pages[route] ?? {};
    const result: Record<string, unknown> = {};
    for (const field of fields) {
      result[field.key] = (current[field.key] as string) ?? fallback(route, field.key);
    }
    if (isCustom) {
      result.title = current.title ?? "";
      result.description = current.description ?? "";
      result.custom = true;
      result.slug = current.slug;
      result.showInNav = current.showInNav ?? true;
    }
    return result as PageCopy;
  });

  const handleSave = () => {
    updatePageCopy(route, draft);
    onDone();
  };

  const handleReset = () => {
    if (isCustom) {
      onDone();
    } else if (confirm(`Reset "${route}" to the default text?`)) {
      resetPageCopy(route);
      onDone();
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {isCustom && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Title</label>
              <input
                type="text"
                value={draft.title ?? ""}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Subtitle / Description</label>
              <textarea
                rows={4}
                value={draft.description ?? ""}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.showInNav ?? true}
                onChange={(e) => setDraft((prev) => ({ ...prev, showInNav: e.target.checked }))}
                className="rounded border-border"
              />
              Show in navigation
            </label>
          </>
        )}
        {!isCustom && fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs font-medium text-muted">{field.label}</label>
            <input
              type="text"
              value={(draft[field.key] as string | undefined) ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-6">
        {!isCustom && (
          <button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
            <Undo2 className="h-3.5 w-3.5" />
            Reset to default
          </button>
        )}
        <button type="button" onClick={() => onDone()} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover transition-colors">Cancel</button>
        <button type="button" onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors">Save</button>
      </div>
    </div>
  );
}