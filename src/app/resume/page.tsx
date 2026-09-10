"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { useContent } from "@/lib/content-store";

export default function ResumePage() {
  const { experiences, skillGroups, pages, profile } = useContent();
  const copy = pages["/resume"] ?? {};
  const pageTitle = copy.title ?? "Resume";
  const pageDescription =
    copy.description ?? "A concise overview of my professional journey.";
  const summary = copy.bio ?? profile.headline;
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-mono text-sm text-primary">Curriculum</p>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted mt-1">{pageDescription}</p>
        </div>
        <a
          href="/resume.pdf"
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:bg-surface-hover transition-colors"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      {/* Summary */}
      <div className="border-t border-border pt-6 mt-10">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="text-muted leading-relaxed mt-3">{summary}</p>
      </div>

      {/* Experience */}
      <div className="border-t border-border pt-6 mt-10">
        <h2 className="text-lg font-semibold">Experience</h2>
        {experiences.length > 0 ? (
          <div className="mt-3 space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <p className="font-mono text-sm text-muted">{exp.period}</p>
                <p className="font-medium">{exp.title}</p>
                <p className="text-primary text-sm">{exp.company}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted mt-3">
            Add entries in the{" "}
            <Link href="/admin" className="text-primary hover:underline">
              Content Dashboard
            </Link>
            .
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="border-t border-border pt-6 mt-10">
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="mt-3 space-y-1">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="flex flex-wrap items-center gap-2 py-1.5"
            >
              <span className="w-28 shrink-0 text-sm font-medium text-muted">
                {group.category}
              </span>
              <span className="text-sm text-foreground/80">
                {group.skills.join(" · ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="border-t border-border pt-6 mt-10">
        <h2 className="text-lg font-semibold">Languages</h2>
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center">
            <span className="w-28 font-medium">Portuguese</span>
            <span className="text-muted">Native</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">English</span>
            <span className="text-muted">Professional</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium">Spanish</span>
            <span className="text-muted">Intermediate</span>
          </div>
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="border-t border-border pt-6 mt-10">
        <h2 className="text-lg font-semibold">Education & Certifications</h2>
        <ul className="mt-3 space-y-2">
          <li>
            <span className="font-medium">
              Modules/H2B Full Stack Development
            </span>
          </li>
          <li>
            <span className="font-medium">AWS Cloud Practitioner</span>
            <span className="text-muted ml-2">(in progress)</span>
          </li>
          <li>
            <span className="font-medium">
              WordPress Enterprise Certifications
            </span>
          </li>
        </ul>
      </div>

      {/* Tip */}
      <div className="mt-10 rounded-lg border border-border bg-surface p-4 text-sm text-muted">
        This resume is also available as a printable PDF.
      </div>
    </div>
  );
}
