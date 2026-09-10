"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BellIcon,
  Check,
  Share2,
  SparklesIcon,
} from "lucide-react";

import type { Project } from "@/types";
import { CATEGORY_TEXT_COLORS } from "@/types";
import LinkTypeIcon from "@/components/LinkTypeIcon";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [copied, setCopied] = useState(false);
  const coverImage = project.images?.find((image) => image.order === 0) ?? project.images?.[0];

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/projects/${project.slug}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-surface p-3 transition-all duration-200 hover:border-primary/30">
        <Link href={`/projects/${project.slug}`} className="relative h-48 w-full flex-none overflow-hidden rounded-lg bg-surface-hover">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={coverImage.caption ?? project.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </Link>

        <div className="flex items-center justify-between gap-3 px-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-hover px-2.5 py-1 text-xs font-medium text-muted">
            <BellIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {project.category[0]}
          </span>
          <div className="flex items-center gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary-foreground">
                <SparklesIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Featured
              </span>
            )}
            <span className="font-mono text-xs uppercase text-muted">
              {project.year}
            </span>
          </div>
        </div>

        <div className="flex-1 px-1">
          <h3 className="text-base font-semibold text-foreground">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-primary transition-colors"
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">{project.summary}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.category.slice(1).map((category) => (
              <span
                key={category}
                className={`text-xs font-medium ${CATEGORY_TEXT_COLORS[category]}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            {project.links.map((link) => (
              <a
                key={link.type}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label ?? link.type}
                onClick={(e) => e.stopPropagation()}
                className="text-muted transition-colors hover:text-foreground"
              >
                <LinkTypeIcon type={link.type} className="h-4 w-4" />
              </a>
            ))}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Copy link"
              title="Copy link"
              className="text-muted transition-colors hover:text-foreground"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
            </button>
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            View project
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}