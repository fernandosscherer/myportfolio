import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProjectBySlug, projects } from "@/lib/projects";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Check,
  Calendar,
  User,
  Users,
  Target,
  Clock,
} from "lucide-react";
import { CATEGORY_TEXT_COLORS } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    keywords: project.tags,
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc pl-5 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="text-foreground/80 leading-relaxed">
              {item.slice(2)}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-xl font-bold mt-8 mb-3">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={key++} className="text-2xl font-bold mt-8 mb-3">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line);
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={key++} className="text-foreground/80 leading-relaxed">
          {line}
        </p>,
      );
    }
  }
  flushList();

  return elements;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-[980px] mx-auto px-4 md:px-6 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {project.category.map((category) => (
            <span
              key={category}
              className={`text-sm font-medium ${CATEGORY_TEXT_COLORS[category]}`}
            >
              {category}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="font-mono text-sm text-muted flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {project.year}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
              project.status === "Featured"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-surface-hover text-muted border-border"
            }`}
          >
            {project.status}
          </span>
        </div>

        <p className="text-lg text-muted max-w-content mb-8">
          {project.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {project.links?.map((link) => (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.type === "github" ? (
                <GitBranch className="h-4 w-4" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {link.type === "github" ? "Source" : link.label ?? link.type}
            </a>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        <div className="min-w-0">
          {project.description && (
            <section className="mb-12 whitespace-pre-line">
              {renderMarkdown(project.description)}
            </section>
          )}

          {project.tags && project.tags.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold mt-8 mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-surface border border-border font-mono text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {project.features && project.features.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold mt-8 mb-3">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(project.challenges || project.solution) && (
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.challenges && (
                  <div>
                    <h2 className="text-xl font-bold mb-3">Challenges</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {project.challenges}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <h2 className="text-xl font-bold mb-3">Solution</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-8 self-start">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-lg font-bold mb-5">Project Details</h2>
            <div className="divide-y divide-border">
              {project.results?.role && (
                <div className="flex items-center gap-3 pb-4 pt-0 first:pt-0">
                  <User className="h-4 w-4 text-muted shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Role</p>
                    <p className="text-sm font-medium">{project.results.role}</p>
                  </div>
                </div>
              )}
              {project.results?.duration && (
                <div className="flex items-center gap-3 py-4">
                  <Clock className="h-4 w-4 text-muted shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Duration</p>
                    <p className="text-sm font-medium">{project.results.duration}</p>
                  </div>
                </div>
              )}
              {project.results?.team && (
                <div className="flex items-center gap-3 py-4">
                  <Users className="h-4 w-4 text-muted shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Team</p>
                    <p className="text-sm font-medium">{project.results.team}</p>
                  </div>
                </div>
              )}
              {project.results?.impact && (
                <div className="flex items-center gap-3 pt-4">
                  <Target className="h-4 w-4 text-muted shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Impact</p>
                    <p className="text-sm font-medium">{project.results.impact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {project.images && project.images.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-5">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.images.map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-lg border border-border bg-surface flex items-center justify-center text-xs text-muted"
              >
                Cover image
              </div>
            ))}
          </div>
        </section>
      )}

      {project.architecture && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-5">Architecture</h2>
          <div className="rounded-xl border border-border bg-surface aspect-video flex items-center justify-center text-sm text-muted">
            Architecture diagram
          </div>
        </section>
      )}
    </div>
  );
}
