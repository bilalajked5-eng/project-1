import type { Project } from '@/content/projects'
import { ProjectTile } from './Cards'

interface ProjectCardProps {
  project: Project
  ratio?: string
  size?: 'lg' | 'md'
  headingLevel?: 2 | 3
  className?: string
}

/** Portfolio card. Portrait ratios render as tall tiles. */
export function ProjectCard({ project, ratio = '', headingLevel = 3, className }: ProjectCardProps) {
  return <ProjectTile project={project} tall={ratio.includes('4/5') || ratio.includes('3/4')} headingLevel={headingLevel} className={className} />
}
