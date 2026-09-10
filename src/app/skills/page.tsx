"use client";

import { useContent } from "@/lib/content-store";
import Link from "next/link";
import { Code2, Server, Cpu, Cloud, Workflow, Pencil } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="h-5 w-5 text-primary" />,
  Backend: <Server className="h-5 w-5 text-primary" />,
  AI: <Cpu className="h-5 w-5 text-primary" />,
  Cloud: <Cloud className="h-5 w-5 text-primary" />,
  Automation: <Workflow className="h-5 w-5 text-primary" />,
};

export default function SkillsPage() {
  const { skillGroups, pages } = useContent();
  const copy = pages["/skills"] ?? {};
  const pageTitle = copy.title ?? "Skills";
  const pageDescription =
    copy.description ??
    "The technologies and tools I use to build production-ready products.";

  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <p className="font-mono text-sm text-primary">Stack</p>
      <h1 className="text-3xl font-bold mt-2">{pageTitle}</h1>
      <p className="text-muted mt-2">{pageDescription}</p>

      {skillGroups.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/50 p-12 text-center">
          <Pencil className="h-8 w-8 text-muted" />
          <p className="font-medium">No skills yet</p>
          <p className="text-sm text-muted">
            Add skill groups in the{" "}
            <Link href="/admin" className="text-primary hover:underline">
              Content Dashboard
            </Link>
            .
          </p>
        </div>
      ) : (
        skillGroups.map((group, i) => (
          <div
            key={group.category}
            className={i > 0 ? "border-t border-border mt-8 pt-6" : "mt-10"}
          >
            <div className="flex items-center gap-2">
              {iconMap[group.category] ?? (
                <Cpu className="h-5 w-5 text-primary" />
              )}
              <h2 className="text-xl font-semibold">{group.category}</h2>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full border border-border bg-surface font-mono text-xs text-muted hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}