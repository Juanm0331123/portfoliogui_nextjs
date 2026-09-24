import Image from 'next/image'
import { SwarmAnchor } from '@/shared/three'
import { PORTRAIT } from '../model'

/** A soft rim of cold light behind the silhouette — it lights the edges, never the face. */
const BACKLIGHT =
    'drop-shadow(-3px -5px 9px color-mix(in oklab, var(--accent) 38%, transparent)) drop-shadow(0 0 26px color-mix(in oklab, var(--accent) 14%, transparent))'

/** Fades the figure into the page: the legs dissolve, nothing is cut off. */
const FADE = 'linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.5) 74%, transparent 94%)'

const fadeMask = {
    maskImage: FADE,
    WebkitMaskImage: FADE,
} as const

/** The grain is clipped to the figure itself: its alpha, then the same fade. */
const grainMask = {
    maskImage: `url(${PORTRAIT.src}), ${FADE}`,
    WebkitMaskImage: `url(${PORTRAIT.src}), ${FADE}`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
} as const

const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * An editorial treatment, not an avatar: the cutout in its own natural
 * colours, standing on the page's black, a soft cold backlight rimming it from
 * behind the left shoulder, the legs fading into the ground, and a light film
 * grain on the figure only. No frame, no box shadow, no recolouring.
 *
 * The halo sits in the canvas BEHIND this component; the face box tells the
 * swarm to keep its particles off the face.
 */
export function AboutPortrait({ alt }: { alt: string }) {
    return (
        <div className="relative mx-auto w-[min(22rem,78vw)] lg:mx-0 lg:w-full lg:max-w-[25rem]" style={{ aspectRatio: `${PORTRAIT.width} / ${PORTRAIT.height}` }}>
            <div
                aria-hidden="true"
                className="absolute inset-[-10%] rounded-full opacity-40 blur-2xl"
                style={{ background: 'radial-gradient(closest-side at 38% 34%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 72%)' }}
            />

            {/* The backlight: drop-shadows follow the cutout's alpha (already
                faded at the bottom by the mask), so the cold light rims the
                silhouette itself — no box, no frame. The wrapper carries them so
                the image's mask cannot clip the glow. */}
            <div className="relative h-full w-full" style={{ filter: BACKLIGHT }}>
                <Image
                    src={PORTRAIT.src}
                    alt={alt}
                    width={PORTRAIT.width}
                    height={PORTRAIT.height}
                    sizes="(min-width: 1024px) 25rem, 78vw"
                    className="h-full w-full"
                    style={fadeMask}
                />
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px', ...grainMask }}
            />

            <SwarmAnchor name="face" className="pointer-events-none absolute" style={PORTRAIT.face} />
            <SwarmAnchor name="about" className="pointer-events-none absolute" style={PORTRAIT.halo} />
        </div>
    )
}
