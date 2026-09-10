"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useContent } from "@/lib/content-store";
import LinkTypeIcon from "@/components/LinkTypeIcon";

export default function AboutPage() {
  const { pages, profile } = useContent();
  const copy = pages["/about"] ?? {};
  const pageTitle = copy.title ?? profile.name;
  const bioOne = copy.description ?? profile.headline;
  const bioTwo =
    copy.bio ??
    "With a focus on shipping, I lead projects end-to-end: architecture, interface, infrastructure and deployment.";
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <p className="font-mono text-sm text-primary mb-2">About</p>
      <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>

      <div className="rounded-xl border border-border bg-surface p-6 flex items-start gap-4 mb-10">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
          {profile.photo ? (
            <Image src={profile.photo} alt={profile.name} fill unoptimized className="object-cover" />
          ) : (
            <span className="text-white font-bold text-xl">{profile.initials}</span>
          )}
        </div>
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-muted">{profile.role}</p>
        </div>
      </div>

      <div className="text-muted leading-relaxed space-y-4 mb-10">
        <p>{bioOne}</p>
        <p>{bioTwo}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {profile.indicators.map((indicator) => (
          <div
            key={indicator.label}
            className="rounded-lg border border-border bg-surface p-4 text-center"
          >
            <p className="text-2xl font-mono font-bold">{indicator.value}</p>
            <p className="text-xs text-muted mt-1">{indicator.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">What I focus on</h2>
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-sm">Web &amp; SaaS</p>
          <p className="text-sm text-muted mt-1">
            Building fast, accessible, conversion-focused products.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-sm">AI &amp; Automation</p>
          <p className="text-sm text-muted mt-1">
            Agents, MCP servers and workflow automation.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium text-sm">Cloud &amp; Infrastructure</p>
          <p className="text-sm text-muted mt-1">
            Docker, CDN, edge deployment and scaling.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-10 flex-wrap">
        {profile.socials.map((social) => (
          <a
            key={social.type}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            <LinkTypeIcon type={social.type} className="h-5 w-5" />
          </a>
        ))}
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="text-muted hover:text-foreground transition-colors"
          >
            <Mail className="h-5 w-5" />
          </a>
        )}
        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="text-muted hover:text-foreground transition-colors"
          >
            <Phone className="h-5 w-5" />
          </a>
        )}
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4" />
          {profile.location} — Remote friendly
        </span>
      </div>

      <Link
        href="/contact"
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover inline-flex items-center gap-2"
      >
        Let&apos;s Talk
      </Link>
    </div>
  );
}