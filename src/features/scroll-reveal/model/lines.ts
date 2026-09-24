/**
 * Groups a RevealText's words into the lines the browser actually laid them
 * out on, by their offsetTop. This is the whole "SplitText": React renders the
 * words, the layout decides the lines, and this reads the result.
 */
export function groupWordsByLine(root: HTMLElement): HTMLElement[][] {
    const words = Array.from(root.querySelectorAll<HTMLElement>('[data-word]'))
    const lines: HTMLElement[][] = []
    let lastTop = Number.NaN

    for (const word of words) {
        const top = word.offsetTop
        if (Number.isNaN(lastTop) || Math.abs(top - lastTop) > 2) {
            lines.push([])
            lastTop = top
        }
        const inner = word.querySelector<HTMLElement>('[data-word-inner]')
        if (inner) lines[lines.length - 1].push(inner)
    }
    return lines
}
