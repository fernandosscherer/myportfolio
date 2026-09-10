"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, ArrowRight } from "lucide-react";

import type { Project } from "@/types";
import { CATEGORY_TEXT_COLORS } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const visibleTags = project.tags.slice(0, 5);
  const remainingCount = project.tags.length - 5;

  const githubLink = project.links.find((link) => link.type === "github");
  const websiteLink = project.links.find((link) => link.type === "website");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <div className="relative bg-surface border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-200 h-full">
        <Link
          href={`/projects/${project.slug}`}
          className="absolute inset-0 rounded-lg"
          aria-label={project.title}
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {project.category.map((category) => (
              <span
                key={category}
                className={`text-xs font-medium ${CATEGORY_TEXT_COLORS[category]}`}
              >
                {category}
              </span>
            ))}
          </div>
          <span className="text-xs text-muted font-mono uppercase">
            {project.year}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="relative hover:text-primary transition-colors"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-sm text-muted mt-2 line-clamp-2">{project.summary}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-surface-hover text-xs text-muted font-mono border border-border"
            >
              {tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-surface-hover text-xs text-muted font-mono border border-border">
              +{remainingCount} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border relative">
          {githubLink && (
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={(e) => e.stopPropagation()}
              className="text-muted hover:text-foreground transition-colors relative z-10"
            >
              <GitBranch className="h-4 w-4" />
            </a>
          )}
          {websiteLink && (
            <a
              href={websiteLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              onClick={(e) => e.stopPropagation()}
              className="text-muted hover:text-foreground transition-colors relative z-10"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <ArrowRight className="h-4 w-4 text-muted ml-auto" />
        </div>
      </div>
    </motion.div>
  );
}