import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { siteConfig } from "@/lib/config";

export default function AboutPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <p className="font-mono text-sm text-primary mb-2">About</p>
      <h1 className="text-3xl font-bold mb-8">{siteConfig.name}</h1>

      <div className="rounded-xl border border-border bg-surface p-6 flex items-start gap-4 mb-10">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold text-xl shrink-0">
          {siteConfig.initials}
        </div>
        <div>
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="text-sm text-muted">{siteConfig.role}</p>
        </div>
      </div>

      <div className="text-muted leading-relaxed space-y-4 mb-10">
        <p>
          {siteConfig.headline}
        </p>
        <p>
          With a focus on shipping, I lead projects end-to-end: architecture,
          interface, infrastructure and deployment. Replace this text with your
          own bio in{" "}
          <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs border border-border">
            src/app/about/page.tsx
          </code>
          .
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {siteConfig.indicators.map((indicator) => (
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

      <div className="flex items-center gap-3 mb-10">
        <a
          href={siteConfig.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          <GithubIcon className="h-5 w-5" />
        </a>
        <a
          href={siteConfig.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          <LinkedinIcon className="h-5 w-5" />
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-muted hover:text-foreground transition-colors"
        >
          <Mail className="h-5 w-5" />
        </a>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4" />
          {siteConfig.location} — Remote friendly
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