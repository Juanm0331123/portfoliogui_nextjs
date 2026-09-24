import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Every scroll-driven change on this site is a pure function of the scroll
 * position: scroll down and back up and the page is exactly where it started.
 * That rules out `once`, `toggleActions`, and enter/leave callbacks that write
 * state, so every trigger goes through `scrubbed()`, which pins `scrub` and
 * `invalidateOnRefresh` and does not let a caller turn either off.
 *
 * `scrub: 1` is the catch-up time in seconds: it smooths the value toward the
 * scroll position without making it depend on direction or history — a given
 * scroll position always settles on the same visual state.
 */
export const SCRUB = 1

let registered = false

export function registerScrollTrigger() {
    if (registered) return
    registered = true
    gsap.registerPlugin(ScrollTrigger)
}

export function scrubbed(vars: ScrollTrigger.Vars): ScrollTrigger.Vars {
    return { ...vars, scrub: SCRUB, invalidateOnRefresh: true }
}

/**
 * Re-measures every trigger and puts every scrubbed animation exactly where
 * the scroll position says it should be — no one-second catch-up.
 *
 * The catch-up is right while scrolling; it is wrong on load. After a reload
 * halfway down the page (or once fonts change the layout) it would replay the
 * page's transitions from the top in fast-forward, which reads as a glitch.
 */
export function settleScrollTriggers() {
    registerScrollTrigger()
    ScrollTrigger.refresh()
    ScrollTrigger.getAll().forEach((trigger) => {
        trigger.getTween()?.progress(1)
        trigger.animation?.progress(trigger.progress)
    })
}
