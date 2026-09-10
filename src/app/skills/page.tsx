import { skillGroups } from "@/lib/projects"
import { Code2, Server, Cpu, Cloud, Workflow } from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="h-5 w-5 text-primary" />,
  Backend: <Server className="h-5 w-5 text-primary" />,
  AI: <Cpu className="h-5 w-5 text-primary" />,
  Cloud: <Cloud className="h-5 w-5 text-primary" />,
  Automation: <Workflow className="h-5 w-5 text-primary" />,
}

export default function SkillsPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-6 py-16">
      <p className="font-mono text-sm text-primary">Stack</p>
      <h1 className="text-3xl font-bold mt-2">Skills</h1>
      <p className="text-muted mt-2">
        The technologies and tools I use to build production-ready products.
      </p>

      {skillGroups.map((group, i) => (
        <div key={group.category} className={i > 0 ? "border-t border-border mt-8 pt-6" : "mt-10"}>
          <div className="flex items-center gap-2">
            {iconMap[group.category] ?? <Cpu className="h-5 w-5 text-primary" />}
            <h2 className="text-xl font-semibold">{group.category}</h2>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {group.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full border border-border bg-surface font-mono text-xs text-muted hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
