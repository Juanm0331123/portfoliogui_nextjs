import { useEffect, useLayoutEffect } from 'react'

/**
 * Scroll-linked initial states have to land before the browser paints, or the
 * final state flashes for a frame. useLayoutEffect warns during SSR, so the
 * server gets the plain effect.
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
