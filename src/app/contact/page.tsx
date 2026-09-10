"use client";

import { Mail, MessageSquare, CalendarClock, Phone } from "lucide-react";
import { PAGE_DEFAULTS, useContent } from "@/lib/content-store";
import LinkTypeIcon from "@/components/LinkTypeIcon";

export default function ContactPage() {
  const { pages, profile } = useContent();
  const copy = pages["/contact"] ?? {};
  const pageTitle = copy.title ?? PAGE_DEFAULTS["/contact"].title;
  const pageDescription = copy.description ?? PAGE_DEFAULTS["/contact"].description;

  const groupedSocials = profile.socials;

  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <header className="text-center space-y-3 mb-10">
        <p className="font-mono text-sm text-primary">Contact</p>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
        <p className="text-muted max-w-md mx-auto">{pageDescription}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href={profile.email ? `mailto:${profile.email}` : "#"}
          className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center text-center gap-2"
        >
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Email</span>
          <span className="text-xs font-mono text-muted">
            {profile.email || "—"}
          </span>
          {profile.email && (
            <span className="text-sm text-primary hover:underline">
              Send email
            </span>
          )}
        </a>

        {groupedSocials.slice(0, 2).map((social) => (
          <a
            key={social.type}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center text-center gap-2"
          >
            <LinkTypeIcon type={social.type} className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{social.label ?? social.type}</span>
            <span className="text-sm text-primary hover:underline">
              Connect
            </span>
          </a>
        ))}

        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="rounded-lg border border-border bg-surface p-6 flex flex-col items-center text-center gap-2"
          >
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Phone</span>
            <span className="text-xs font-mono text-muted">{profile.phone}</span>
            <span className="text-sm text-primary hover:underline">Call</span>
          </a>
        )}
      </div>

      {(profile.companyName || profile.companyDescription) && (
        <div className="rounded-xl border border-border bg-surface p-6 mt-8 flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">{profile.companyName}</p>
            <p className="text-sm text-muted">{profile.companyDescription}</p>
            {profile.companyWebsite && (
              <a
                href={profile.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-block"
              >
                Visit {profile.companyName?.toLowerCase().replaceAll(" ", "")} →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted">
        <CalendarClock className="h-4 w-4 text-primary" />
        Response time: {profile.responseTime || "within 24 hours"}.{" "}
        {profile.availability ? `Currently ${profile.availability.toLowerCase()}.` : ""}
      </div>

      {profile.calendly && (
        <div className="mt-6">
          <a
            href={profile.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-primary-hover inline-block"
          >
            Book a call
          </a>
        </div>
      )}
    </div>
  );
}
