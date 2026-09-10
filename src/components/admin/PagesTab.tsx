"use client";

import { useState } from "react";
import { FileText, Pencil, Undo2, X } from "lucide-react";
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
  const { pages } = useContent();
  const [editingRoute, setEditingRoute] = useState<string | null>(null);

  return (
    <div>
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
      </div>

      {editingRoute && (
        <div className="rounded-xl border border-border bg-surface p-6 mt-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">
              Edit {PAGE_ROUTES.find((p) => p.route === editingRoute)?.label}
              <span className="font-mono text-xs text-muted ml-2">
                {editingRoute}
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setEditingRoute(null)}
              aria-label="Close"
              className="p-1 text-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <PageForm route={editingRoute} onDone={() => setEditingRoute(null)} />
        </div>
      )}
    </div>
  );
}

function PageForm({ route, onDone }: { route: string; onDone: () => void }) {
  const { pages, updatePageCopy, resetPageCopy } = useContent();
  const fields = SPECIAL_FIELDS[route] ?? COMMON_FIELDS;
  const [draft, setDraft] = useState<PageCopy>(() =>
    fields.reduce<PageCopy>((acc, field) => {
      const current = pages[route]?.[field.key];
      acc[field.key] = current ?? fallback(route, field.key);
      return acc;
    }, {}),
  );

  const handleSave = () => {
    updatePageCopy(route, draft);
    onDone();
  };

  const handleReset = () => {
    if (confirm(`Reset "${route}" to the default text?`)) {
      resetPageCopy(route);
      onDone();
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              {field.label}
            </label>
            <input
              type="text"
              value={draft[field.key] ?? ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
        >
          <Undo2 className="h-3.5 w-3.5" />
          Reset to default
        </button>
        <button
          type="button"
          onClick={() => onDone()}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}