"use client";

import { Mail, Heart } from "lucide-react";
import { useContent } from "@/lib/content-store";
import LinkTypeIcon from "@/components/LinkTypeIcon";

export default function Footer() {
  const { profile } = useContent();
  const year = new Date().getFullYear();
  const githubSocial = profile.socials.find((s) => s.type === "github");
  const linkedinSocial = profile.socials.find((s) => s.type === "linkedin");

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted">
          &copy; {year} {profile.name || "Your Name"}. Built with{" "}
          <span className="inline-flex items-center">
            <Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
          </span>{" "}
          Next.js
        </p>
        <div className="flex items-center gap-4">
          {githubSocial && (
            <a
              href={githubSocial.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted transition-colors hover:text-foreground"
            >
              <LinkTypeIcon type="github" className="h-5 w-5" />
            </a>
          )}
          {linkedinSocial && (
            <a
              href={linkedinSocial.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted transition-colors hover:text-foreground"
            >
              <LinkTypeIcon type="linkedin" className="h-5 w-5" />
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="text-muted transition-colors hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}