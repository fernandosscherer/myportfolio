"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  MapPin,
  Sparkles,
  FolderGit2,
  Briefcase,
  FolderPlus,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { useContent } from "@/lib/content-store";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { siteConfig } from "@/lib/config";

const indicatorIcons = [Briefcase, FolderGit2, Sparkles] as const;

export default function Home() {
  const { projects, pages } = useContent();
  const homeCopy = pages["/"] ?? {};
  const headline = homeCopy.headline ?? siteConfig.headline;
  const ctaTitle = homeCopy.title ?? "Let's build something together";
  const ctaText =
    homeCopy.description ??
    "I help startups and companies build high-quality websites, SaaS products, AI integrations and automation systems.";
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const roleParts = siteConfig.role.split("•").map((p) => p.trim());

  return (
    <div className="mx-auto max-w-[1280px] px-4 md:px-6">
      {/* Hero Section */}
      <section className="flex flex-col items-center py-20 md:py-28 text-center animate-fade-in">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="h-[120px] w-[120px] rounded-full bg-gradient-to-br from-primary to-primary-hover p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-surface text-4xl font-bold text-primary">
                {siteConfig.initials}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success ring-4 ring-background animate-pulse-dot" />
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            {siteConfig.name}
          </h1>

          <p className="mt-4 text-base md:text-lg text-muted font-medium">
            {roleParts.map((part, i) => (
              <span key={part}>
                {part}
                {i < roleParts.length - 1 && (
                  <span className="text-primary"> • </span>
                )}
              </span>
            ))}
          </p>

          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted">
            {headline}
          </p>

          <div className="mt-6 flex items-center gap-4 text-xs md:text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {siteConfig.location}
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
              {siteConfig.availability}
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              View Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="/resume"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted transition-colors hover:text-foreground"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted transition-colors hover:text-foreground"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </motion.div>

        {/* Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {siteConfig.indicators.map((indicator, i) => {
            const Icon = indicatorIcons[i] ?? Briefcase;
            return (
              <div
                key={indicator.label}
                className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-4"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-mono text-2xl font-bold text-foreground">
                  {indicator.value}
                </span>
                <span className="text-xs text-muted">{indicator.label}</span>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-sm text-primary">Featured Work</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
              Selected Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/50 p-12 text-center">
            <FolderPlus className="h-8 w-8 text-muted" />
            <p className="font-medium text-foreground">No featured projects yet</p>
            <p className="text-sm text-muted">
              Add and feature projects in the{" "}
              <Link href="/admin" className="text-primary hover:underline">
                Content Dashboard
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 md:pb-24">
        <div className="rounded-2xl border border-border bg-surface p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm md:text-base text-muted">
            {ctaText}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}