/**
 * The stack, as the Skills lattice lays it out. Order matters: it matches the
 * lattice's node order (centre, then six sectors of three), so each family's
 * technologies sit next to each other on screen. Names are proper nouns and
 * are never translated; family names are copy under `Skills.families`.
 */
export type SkillFamily = 'frontend' | 'backend' | 'python' | 'data' | 'deploy' | 'ai'

export type SkillNode = {
    name: string
    family: SkillFamily
}

export const skillFamilies: SkillFamily[] = ['frontend', 'backend', 'python', 'data', 'deploy', 'ai']

export const skillNodes: SkillNode[] = [
    { name: 'TypeScript', family: 'frontend' },
    { name: 'React', family: 'frontend' },
    { name: 'Next.js', family: 'frontend' },
    { name: 'Tailwind CSS', family: 'frontend' },
    { name: 'Node.js', family: 'backend' },
    { name: 'Express', family: 'backend' },
    { name: 'NestJS', family: 'backend' },
    { name: 'Python', family: 'python' },
    { name: 'FastAPI', family: 'python' },
    { name: 'REST', family: 'python' },
    { name: 'PostgreSQL', family: 'data' },
    { name: 'MongoDB', family: 'data' },
    { name: 'MySQL', family: 'data' },
    { name: 'Docker', family: 'deploy' },
    { name: 'Google Cloud', family: 'deploy' },
    { name: 'Vercel', family: 'deploy' },
    { name: 'Vertex AI', family: 'ai' },
    { name: 'Amazon Bedrock', family: 'ai' },
    { name: 'MCP', family: 'ai' },
]

export function familyIndex(family: SkillFamily): string {
    return String(skillFamilies.indexOf(family) + 1).padStart(2, '0')
}
