import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

// Control points mirror the --ease-* custom properties in globals.css, so CSS
// and GSAP motion share the exact same curves.
const CURVE_POINTS = {
    out: '0.23, 1, 0.32, 1',
    inOut: '0.77, 0, 0.175, 1',
    expo: '0.16, 1, 0.3, 1',
} as const

export const gsapEase = {
    out: 'ease-out-strong',
    inOut: 'ease-in-out-strong',
    expo: 'ease-out-expo',
} as const

let registered = false

export function registerGsapEasing() {
    if (registered) return
    registered = true

    gsap.registerPlugin(CustomEase)
    CustomEase.create(gsapEase.out, CURVE_POINTS.out)
    CustomEase.create(gsapEase.inOut, CURVE_POINTS.inOut)
    CustomEase.create(gsapEase.expo, CURVE_POINTS.expo)
}
