"use client";

import { useState } from "react";
import type { Experience } from "@/types";

const inputClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30";

interface ExperienceFormProps {
  initial?: Experience | null;
  onSubmit: (data: Omit<Experience, "id">) => void;
  onCancel: () => void;
}

export default function ExperienceForm({
  initial,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [form, setForm] = useState<Omit<Experience, "id">>({
    period: initial?.period ?? "",
    title: initial?.title ?? "",
    company: initial?.company ?? "",
    description: initial?.description ?? "",
    current: initial?.current ?? false,
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Period
          </label>
          <input
            type="text"
            required
            value={form.period}
            onChange={(e) => set("period", e.target.value)}
            placeholder="2023 — Present"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Company
          </label>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Title / Role
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Founder"
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className={inputClass}
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.current ?? false}
          onChange={(e) => set("current", e.target.checked)}
          className="rounded border-border"
        />
        Current role
      </label>
      <div className="flex items-center justify-end gap-2 pt-1">
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
          {initial ? "Save changes" : "Add experience"}
        </button>
      </div>
    </form>
  );
}