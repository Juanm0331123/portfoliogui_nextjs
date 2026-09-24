'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/lib'
import { onSkillNodes, SwarmAnchor } from '@/shared/three'
import { latticeLabels } from '../model'

/**
 * The technologies, pinned to the nodes of the swarm's lattice, on every
 * screen size.
 *
 * The engine projects the lattice's nodes to the screen every frame and hands
 * over their positions plus a visibility that is a function of the scroll;
 * this writes them straight onto the list items, outside React. Each label
 * points away from the lattice's centre: nodes on the left carry their name
 * on the left, nodes on the right on the right, and nodes on the centre
 * column above or below — so neighbours never collide and nothing runs off a
 * phone's edge. Until the first frame arrives (or without WebGL) the same
 * list renders as a plain grid.
 */
export function SkillsLattice({ label }: { label: string }) {
    const listRef = useRef<HTMLUListElement>(null)
    const [anchored, setAnchored] = useState(false)

    useEffect(() => {
        let isAnchored = false

        return onSkillNodes(({ points, visibility }) => {
            const list = listRef.current
            if (!list) return
            if (!isAnchored) {
                isAnchored = true
                setAnchored(true)
            }
            const centreX = list.clientWidth / 2
            const centreY = list.clientHeight / 2
            // One lattice step on screen, from the box the lattice is sized to.
            const step = Math.min(list.clientWidth, list.clientHeight) / 5.2
            list.querySelectorAll<HTMLElement>('[data-node]').forEach((item, i) => {
                const x = points[i * 3]
                const y = points[i * 3 + 1]
                const depth = points[i * 3 + 2]
                const side = Math.abs(x - centreX) < step * 0.4 ? (y <= centreY ? 'top' : 'bottom') : x < centreX ? 'left' : 'right'
                if (item.dataset.side !== side) item.dataset.side = side
                const shift =
                    side === 'left' ? '-100%, -50%' : side === 'right' ? '0, -50%' : side === 'top' ? '-50%, calc(-100% + 4px)' : '-50%, -4px'
                item.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${shift})`
                item.style.opacity = (visibility * (0.55 + 0.45 * depth)).toFixed(3)
            })
        })
    }, [])

    return (
        <div className="relative mx-auto aspect-square w-[64%] max-w-[40rem] sm:w-[80%] lg:w-full">
            <SwarmAnchor name="skills" className="pointer-events-none absolute inset-0" />
            <ul
                ref={listRef}
                aria-label={label}
                className={cn(anchored ? 'absolute inset-0' : 'relative grid h-full grid-cols-2 content-center gap-x-6 gap-y-4 sm:grid-cols-3')}
            >
                {latticeLabels.map((node) => (
                    <li
                        key={node.name}
                        data-node
                        data-side="right"
                        className={cn(
                            'flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.625rem] text-ink [text-shadow:0_0_6px_#050507,0_0_12px_#050507] sm:gap-2 sm:text-[0.75rem]',
                            'data-[side=left]:flex-row-reverse data-[side=top]:flex-col-reverse data-[side=top]:gap-1 data-[side=bottom]:flex-col data-[side=bottom]:gap-1',
                            anchored && 'absolute left-0 top-0 will-change-transform',
                        )}
                    >
                        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-ink shadow-[0_0_10px_var(--accent)]" />
                        <span className="flex items-center gap-1.5">
                            <span aria-hidden="true" className="hidden text-[0.625rem] text-accent sm:inline">
                                {node.index}
                            </span>
                            {node.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
