"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Search, X, ArrowRight, Command } from "lucide-react";
import Link from "next/link";
import { searchProjects } from "@/lib/projects";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(false);

  const results = useMemo(() => searchProjects(query), [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!openRef.current) setQuery("");
        openRef.current = !openRef.current;
        setIsOpen(openRef.current);
      } else if (e.key === "Escape" && openRef.current) {
        openRef.current = false;
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto mt-[20vh] max-w-lg overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          <Search className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, technologies..."
            className="w-full bg-transparent text-lg outline-none placeholder:text-muted"
          />
          <button
            onClick={() => {
              openRef.current = false;
              setIsOpen(false);
            }}
            className="text-muted transition-colors hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                onClick={() => {
                  openRef.current = false;
                  setIsOpen(false);
                }}
                className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {project.title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-xs text-muted">
                      {project.category.join(", ")}
                    </span>
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="font-mono text-xs text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted">
            No results found
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-muted">
            {query
              ? `${results.length} result${results.length === 1 ? "" : "s"}`
              : "Press Escape to close"}
          </span>
          <Command className="h-4 w-4 text-muted" />
        </div>
      </div>
    </div>
  );
}