"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useContent } from "@/lib/content-store";
import { ArrowLeft } from "lucide-react";

export default function CustomPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug ?? "";
  const route = `/${slug}`;
  const { pages } = useContent();
  const page = pages[route];

  if (!page?.custom) {
    return (
      <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-muted">This page does not exist.</p>
        <Link href="/" className="text-primary hover:underline text-sm mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16 animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      <header className="mb-10">
        <p className="font-mono text-sm text-primary">{page.title}</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{page.title}</h1>
        {page.description && (
          <p className="text-muted mt-3 whitespace-pre-line">{page.description}</p>
        )}
      </header>
    </div>
  );
}