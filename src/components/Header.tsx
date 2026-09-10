"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, X } from "lucide-react";
import { useContent } from "@/lib/content-store";
import LinkTypeIcon from "@/components/LinkTypeIcon";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const { profile, pages } = useContent();
  const [mobileOpen, setMobileOpen] = useState(false);

  const standardLinks = [
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Skills", href: "/skills" },
    { label: "Resume", href: "/resume" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Admin", href: "/admin" },
  ];

  const customNavLinks = Object.entries(pages)
    .filter(([, v]) => v.custom && v.showInNav !== false)
    .map(([route, v]) => ({ label: v.title ?? route, href: route }));

  const navLinks = [...standardLinks, ...customNavLinks];
  const githubSocial = profile.socials.find((s) => s.type === "github");
  const linkedinSocial = profile.socials.find((s) => s.type === "linkedin");

  return (
    <header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-mono font-bold text-primary border border-border rounded-md px-2 py-1 text-sm"
        >
          {profile.initials || "FS"}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors hover:text-foreground ${
                  isActive ? "text-foreground font-medium" : "text-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {githubSocial && (
            <a
              href={githubSocial.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted transition-colors hover:text-foreground"
            >
              <LinkTypeIcon type="github" className="h-4 w-4" />
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
              <LinkTypeIcon type="linkedin" className="h-4 w-4" />
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-muted transition-colors hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
          <ThemeToggle />

          <button
            className="text-muted transition-colors hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm transition-colors hover:text-foreground ${
                    isActive ? "text-foreground font-medium" : "text-muted"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}