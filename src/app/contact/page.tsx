"use client";

import { Mail, MessageSquare, CalendarClock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { siteConfig } from "@/lib/config";
import { useContent } from "@/lib/content-store";

export default function ContactPage() {
  const { pages } = useContent();
  const copy = pages["/contact"] ?? {};
  const pageTitle = copy.title ?? "Let's talk";
  const pageDescription =
    copy.description ??
    "I'm open to freelance projects, full-time roles and collaborations in AI, Web and Automation.";
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <header className="text-center space-y-3 mb-10">
        <p className="font-mono text-sm text-primary">Contact</p>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted max-w-md mx-auto">{pageDescription}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center text-center gap-2"
        >
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Email</span>
          <span className="text-xs font-mono text-muted">
            {siteConfig.email}
          </span>
          <span className="text-sm text-primary hover:underline">
            Send email
          </span>
        </a>

        <a
          href={siteConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center text-center gap-2"
        >
          <LinkedinIcon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">LinkedIn</span>
          <span className="text-sm text-primary hover:underline">Connect</span>
        </a>

        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center text-center gap-2"
        >
          <GithubIcon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">GitHub</span>
          <span className="text-sm text-primary hover:underline">Follow</span>
        </a>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 mt-8 flex items-start gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold">{siteConfig.company.name}</p>
          <p className="text-sm text-muted">
            {siteConfig.company.description}
          </p>
          <a
            href={siteConfig.company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-block"
          >
            Visit {siteConfig.company.name.toLowerCase().replaceAll(" ", "")} →
          </a>
        </div>
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted">
        <CalendarClock className="h-4 w-4 text-primary" />
        Response time: within 24 hours. Currently open to new projects.
      </div>

      <div className="mt-6">
        <a
          href={siteConfig.calendly}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-primary-hover inline-block"
        >
          Book a call
        </a>
      </div>
    </div>
  );
}
