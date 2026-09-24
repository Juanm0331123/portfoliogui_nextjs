'use client'

import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { registerSwarmAnchor, type SwarmAnchorName } from './store'

type SwarmAnchorProps = ComponentPropsWithoutRef<'div'> & {
    name: SwarmAnchorName
}

/**
 * An invisible box that tells the swarm where a formation sits and how big it
 * is. Position and size come from CSS, so each widget lays out its formation
 * responsively without the engine knowing anything about the layout.
 */
export function SwarmAnchor({ name, ...rest }: SwarmAnchorProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!ref.current) return
        return registerSwarmAnchor(name, ref.current)
    }, [name])

    return <div ref={ref} aria-hidden="true" {...rest} />
}
