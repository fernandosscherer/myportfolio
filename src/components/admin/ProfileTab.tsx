"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Plus, Trash2 } from "lucide-react";
import { useContent } from "@/lib/content-store";
import { resizeImage } from "@/lib/image-utils";
import type { ProfileData, ProjectLinkType } from "@/types";
import LinkTypeIcon from "@/components/LinkTypeIcon";

const LINK_TYPES: ProjectLinkType[] = [
  "github",
  "website",
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "outros",
];

const inputClass =
  "rounded-md border border-border bg-surface px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary/30";

function profileToDraft(profile: ProfileData): ProfileData {
  return JSON.parse(JSON.stringify(profile));
}

export default function ProfileTab() {
  const { profile, updateProfile } = useContent();
  const [draft, setDraft] = useState<ProfileData>(() => profileToDraft(profile));
  const [photoUploading, setPhotoUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const dataUrl = await resizeImage(file, 600);
      set("photo", dataUrl);
    } catch {
      console.error("Could not process the photo");
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const addSocial = () => {
    set("socials", [...draft.socials, { type: "website" as ProjectLinkType, url: "", label: "" }]);
  };

  const updateSocial = (index: number, patch: Partial<{ type: ProjectLinkType; url: string; label: string }>) => {
    set("socials", draft.socials.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const removeSocial = (index: number) => {
    set("socials", draft.socials.filter((_, i) => i !== index));
  };

  const addIndicator = () => {
    set("indicators", [...draft.indicators, { value: "", label: "" }]);
  };

  const updateIndicator = (index: number, patch: Partial<{ value: string; label: string }>) => {
    set("indicators", draft.indicators.map((ind, i) => (i === index ? { ...ind, ...patch } : ind)));
  };

  const removeIndicator = (index: number) => {
    set("indicators", draft.indicators.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateProfile(draft);
  };

  return (
    <div className="space-y-8">
      {/* Photo */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold mb-4">Profile Photo</h3>
        <div className="flex items-start gap-4">
          <div className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-hover">
            {draft.photo ? (
              <Image src={draft.photo} alt="Avatar" fill unoptimized className="object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary">{draft.initials || "?"}</span>
            )}
          </div>
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={photoUploading}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-surface-hover disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {photoUploading ? "Processing..." : "Upload photo"}
            </button>
            {draft.photo && (
              <button
                type="button"
                onClick={() => set("photo", "")}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-surface-hover"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Basic Info */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold mb-4">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Full Name</label>
            <input type="text" value={draft.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Initials</label>
            <input type="text" value={draft.initials} onChange={(e) => set("initials", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted">Role / Title</label>
          <input type="text" value={draft.role} onChange={(e) => set("role", e.target.value)} className={inputClass} />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted">Headline</label>
          <textarea rows={2} value={draft.headline} onChange={(e) => set("headline", e.target.value)} className={inputClass} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Location</label>
            <input type="text" value={draft.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Availability</label>
            <input type="text" value={draft.availability} onChange={(e) => set("availability", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold mb-4">Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
            <input type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Phone</label>
            <input type="tel" value={draft.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+55 51 99999-0000" className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Website</label>
            <input type="url" value={draft.website} onChange={(e) => set("website", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Calendly / Booking</label>
            <input type="url" value={draft.calendly ?? ""} onChange={(e) => set("calendly", e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted">Response time</label>
            <input type="text" value={draft.responseTime ?? ""} onChange={(e) => set("responseTime", e.target.value)} placeholder="within 24 hours" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-semibold mb-4">Company</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Company Name</label>
            <input type="text" value={draft.companyName ?? ""} onChange={(e) => set("companyName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Company Website</label>
            <input type="url" value={draft.companyWebsite ?? ""} onChange={(e) => set("companyWebsite", e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-muted">Description</label>
            <textarea rows={2} value={draft.companyDescription ?? ""} onChange={(e) => set("companyDescription", e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Social Links</h3>
          <button type="button" onClick={addSocial} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add link
          </button>
        </div>
        {draft.socials.length === 0 ? (
          <p className="text-sm text-muted">No social links yet.</p>
        ) : (
          <div className="space-y-3">
            {draft.socials.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <LinkTypeIcon type={link.type} className="h-4 w-4 text-muted shrink-0" />
                <select
                  value={link.type}
                  onChange={(e) => updateSocial(i, { type: e.target.value as ProjectLinkType })}
                  className="w-36 shrink-0 rounded-md border border-border bg-surface px-2 py-2 text-sm outline-none"
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateSocial(i, { url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
                />
                <input
                  type="text"
                  value={link.label ?? ""}
                  onChange={(e) => updateSocial(i, { label: e.target.value })}
                  placeholder="Label"
                  className="w-28 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
                />
                <button type="button" onClick={() => removeSocial(i)} className="p-2 text-muted hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Indicators */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Indicators</h3>
          <button type="button" onClick={addIndicator} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Plus className="h-3.5 w-3.5" /> Add indicator
          </button>
        </div>
        {draft.indicators.length === 0 ? (
          <p className="text-sm text-muted">No indicators yet.</p>
        ) : (
          <div className="space-y-3">
            {draft.indicators.map((ind, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ind.value}
                  onChange={(e) => updateIndicator(i, { value: e.target.value })}
                  placeholder="20+"
                  className="w-24 rounded-md border border-border bg-surface px-3 py-2 text-sm font-mono outline-none"
                />
                <input
                  type="text"
                  value={ind.label}
                  onChange={(e) => updateIndicator(i, { label: e.target.value })}
                  placeholder="Years Experience"
                  className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none"
                />
                <button type="button" onClick={() => removeIndicator(i)} className="p-2 text-muted hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Save profile
        </button>
      </div>
    </div>
  );
}