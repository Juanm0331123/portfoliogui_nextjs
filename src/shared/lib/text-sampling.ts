/**
 * Rasterises a piece of on-screen text and reads its ink back as points, so the
 * swarm can stand in the exact letterforms the DOM is showing.
 *
 * There is no way to read pixels out of the DOM, so the text is redrawn on an
 * offscreen 2D canvas with the element's own computed font, and every opaque
 * enough pixel becomes a point. Coordinates are CSS pixels in viewport space;
 * the conversion to world units needs the camera and happens in the engine.
 */

/** The wordmark is small on screen; supersampling gives the pool enough ink. */
const SUPERSAMPLE = 3
const SAMPLE_STEP = 2
/** Anti-aliased glyph edges below this alpha are noise, not shape. */
const ALPHA_THRESHOLD = 90
/** Slack around the element's box, in case glyph ink overflows its line box. */
const PADDING_RATIO = 0.25

export function sampleTextElement(element: HTMLElement): Float32Array | null {
    const text = element.textContent?.trim()
    if (!text) return null

    const rect = element.getBoundingClientRect()
    if (rect.width < 1 || rect.height < 1) return null

    const padX = rect.width * PADDING_RATIO
    const padY = rect.height * PADDING_RATIO
    const canvas = document.createElement('canvas')
    canvas.width = Math.ceil((rect.width + padX * 2) * SUPERSAMPLE)
    canvas.height = Math.ceil((rect.height + padY * 2) * SUPERSAMPLE)
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    const computed = getComputedStyle(element)
    const fontSize = parseFloat(computed.fontSize) * SUPERSAMPLE
    ctx.font = `${computed.fontStyle} ${computed.fontWeight} ${fontSize}px ${computed.fontFamily}`
    if ('letterSpacing' in ctx && computed.letterSpacing !== 'normal') {
        ctx.letterSpacing = `${parseFloat(computed.letterSpacing) * SUPERSAMPLE}px`
    }
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'

    // Centre the ink box, not the line box: a display face's em metrics sit
    // visibly off from where its letters are actually drawn.
    const metrics = ctx.measureText(text)
    const baseline = (canvas.height + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent)) / 2
    ctx.fillText(text, canvas.width / 2, baseline)

    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const originX = rect.left - padX
    const originY = rect.top - padY

    const collected: number[] = []
    for (let y = 0; y < canvas.height; y += SAMPLE_STEP) {
        for (let x = 0; x < canvas.width; x += SAMPLE_STEP) {
            if (data[(y * canvas.width + x) * 4 + 3] < ALPHA_THRESHOLD) continue
            collected.push(originX + x / SUPERSAMPLE, originY + y / SUPERSAMPLE)
        }
    }

    return collected.length === 0 ? null : Float32Array.from(collected)
}
