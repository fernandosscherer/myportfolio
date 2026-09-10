import { ExternalLink } from "lucide-react";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/Icons";
import type { ProjectLinkType } from "@/types";

interface LinkTypeIconProps {
  type: ProjectLinkType;
  className?: string;
}

export default function LinkTypeIcon({ type, className }: LinkTypeIconProps) {
  switch (type) {
    case "github":
      return <GithubIcon className={className} />;
    case "instagram":
      return <InstagramIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "x":
      return <XIcon className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
}