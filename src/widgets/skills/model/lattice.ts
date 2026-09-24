import { familyIndex, skillNodes } from '@/entities/skill'

export type LatticeLabel = {
    name: string
    /** Two-digit family index, matching the legend. */
    index: string
}

/** One label per lattice node, in the engine's node order. */
export const latticeLabels: LatticeLabel[] = skillNodes.map((node) => ({
    name: node.name,
    index: familyIndex(node.family),
}))

