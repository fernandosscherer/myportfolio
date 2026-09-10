"use client";

import { PAGE_DEFAULTS, useContent } from "@/lib/content-store";
import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export default function ExperiencePage() {
  const { experiences, pages } = useContent();
  const copy = pages["/experience"] ?? {};
  const pageTitle = copy.title ?? PAGE_DEFAULTS["/experience"].title;
  const pageDescription =
    copy.description ?? PAGE_DEFAULTS["/experience"].description;
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16 animate-fade-in">
      <header className="mb-12">
        <p className="font-mono text-sm text-primary">Career</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">
          {pageTitle}
        </h1>
        <p className="text-muted mt-3">{pageDescription}</p>
      </header>

      {experiences.length > 0 ? (
        <div className="border-l border-border pl-8 max-w-prose space-y-10">
          {experiences.map((exp, i) => (
            <div key={exp.id ?? i} className="relative animate-fade-in">
              <div
                className={`absolute -left-[33px] h-4 w-4 rounded-full border-2 ${
                  exp.current
                    ? "bg-primary border-primary"
                    : "border-border bg-surface"
                }`}
              />
              <div>
                <p className="font-mono text-sm text-muted">{exp.period}</p>
                <h2 className="text-lg font-semibold mt-1">{exp.title}</h2>
                <p className="text-primary text-sm font-medium">{exp.company}</p>
                <p className="text-sm text-muted leading-relaxed mt-2">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/50 p-12 text-center max-w-prose">
          <BriefcaseBusiness className="h-8 w-8 text-muted" />
          <p className="font-medium text-foreground">No experience added yet</p>
          <p className="text-sm text-muted">
            Fill the experiences in the{" "}
            <Link href="/admin" className="text-primary hover:underline">
              Content Dashboard
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-surface p-4 text-sm text-muted max-w-prose animate-fade-in">
        Open to freelance and full-time remote opportunities.
      </div>
    </div>
  )
}
