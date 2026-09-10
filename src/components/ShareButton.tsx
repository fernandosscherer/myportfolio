"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

interface ShareButtonProps {
  path: string;
  label?: string;
}

export default function ShareButton({ path, label = "Share" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${path}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy link"
      className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}