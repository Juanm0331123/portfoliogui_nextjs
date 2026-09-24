/**
 * Every formation the swarm takes, built once, up front, from seeded PRNGs.
 *
 * Reversibility starts here: a formation is a fixed buffer, never rebuilt and
 * never re-randomised, so the same scroll position always points the same
 * particle at the same place. Nothing in this file may call Math.random().
 *
 * Each formation is a `Float32Array(count * 4)`: xyz in the formation's own
 * local space plus a luminance in w. A NEGATIVE w marks a world-space point:
 * the shader skips the formation's transform for it and uses |w| as its
 * luminance. That is how the ambient dust stays exactly where it is while the
 * formation around it changes.
 *
 * Local spaces are unit-sized on purpose (the ring has a radius of 1,
 * the lattice a node spacing of 1) so the engine can scale each one to the DOM
 * element it is anchored to.
 */

export const STAGE_SINGULARITY = 0
export const STAGE_HERO = 1
export const STAGE_ABOUT = 2
export const STAGE_SKILLS = 3
export const STAGE_PROJECTS = 4
export const STAGE_EXPERIENCE = 5
export const STAGE_CONTACT = 6
export const STAGE_FOOTER = 7

/** Share of the pool that is ambient dust in every formation from the Hero on. */
const DUST_SHARE = 0.18

export const RING_RADIUS = 1
export const HALO_OUTER = 1.32
export const LATTICE_EXTENT = 2.6
export const VORTEX_INNER = 1

export type Formations = {
    count: number
    dustCount: number
    hero: Float32Array
    about: Float32Array
    skills: Float32Array
    projects: Float32Array
    experience: Float32Array
    contact: Float32Array
    footer: Float32Array
    /** x: transition stagger, y: twinkle rate, z: twinkle phase, w: size. */
    seed: Float32Array
    /** xy: direction on the singularity's sphere, z: its radius, w: sparkle. */
    seed2: Float32Array
}

export function mulberry32(seed: number): () => number {
    let a = seed >>> 0
    return () => {
        a = (a + 0x6d2b79f5) >>> 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function gauss(random: () => number): number {
    return (random() + random() + random() + random() - 2) / 2
}

function write(buffer: Float32Array, i: number, x: number, y: number, z: number, w: number) {
    buffer[i * 4] = x
    buffer[i * 4 + 1] = y
    buffer[i * 4 + 2] = z
    buffer[i * 4 + 3] = w
}

// --- Ambient dust -----------------------------------------------------------

/**
 * World-space dust shared by every formation. Deep in Z so it reads as a field
 * the formations sit in, and dim enough to stay under the bloom threshold.
 */
function fillDust(buffer: Float32Array, dustCount: number) {
    const random = mulberry32(0xd057)
    for (let i = 0; i < dustCount; i++) {
        const z = 2 - Math.pow(random(), 0.7) * 16
        const spread = 1 + (2 - z) * 0.11
        const lum = 0.16 + random() * 0.26
        write(buffer, i, (random() - 0.5) * 22 * spread, (random() - 0.5) * 12.5 * spread, z, -lum)
    }
}

function withDust(count: number, dustCount: number): Float32Array {
    const buffer = new Float32Array(count * 4)
    fillDust(buffer, dustCount)
    return buffer
}

// --- 1 · Hero: a ring of wavy strands ------------------------------------------

/** Concentric strands across the ring's thickness. */
export const RING_STRANDS = 36

/**
 * A face-on ring made of many concentric strands of evenly spaced dots. Stored
 * as (cos θ, sin θ, strand position across the band 0..1, lum): the shader
 * builds the radius from those and a flowing noise field, so every strand
 * ripples on its own while neighbouring strands stay coherent — which is what
 * makes it read as fibres rather than as a cloud.
 */
function buildHero(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0x7040)
    const n = count - dustCount
    const perStrand = Math.ceil(n / RING_STRANDS)

    for (let j = 0; j < n; j++) {
        const strand = j % RING_STRANDS
        const k = Math.floor(j / RING_STRANDS)
        const theta = ((k + random() * 0.4) / perStrand) * Math.PI * 2 + strand * 0.37
        const u = strand / (RING_STRANDS - 1)
        // The strands in the middle of the band carry the light; the edges fray.
        const core = 1 - Math.pow(Math.abs(u - 0.5) * 2, 2)
        write(buffer, dustCount + j, Math.cos(theta), Math.sin(theta), u, 0.4 + core * 0.7 + (random() - 0.5) * 0.1)
    }
    return buffer
}

// --- 2 · About: an orbital halo -----------------------------------------------

const ORBITS = [1, 1.16, HALO_OUTER]
const ORBIT_SHARES = [0.3, 0.24, 0.18]

function buildAbout(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0xab07)
    const n = count - dustCount

    let cursor = dustCount
    ORBITS.forEach((radius, o) => {
        const orbitCount = Math.floor(n * ORBIT_SHARES[o])
        for (let k = 0; k < orbitCount; k++) {
            const theta = ((k + random() * 0.6) / orbitCount) * Math.PI * 2
            const r = radius + gauss(random) * 0.01
            write(buffer, cursor++, Math.cos(theta) * r, Math.sin(theta) * r, gauss(random) * 0.012, 1.05 - o * 0.18)
        }
    })

    // A thin disc of haze between the orbits, so they read as one system.
    while (cursor < count) {
        const theta = random() * Math.PI * 2
        const r = 0.72 + random() * 0.78
        write(buffer, cursor++, Math.cos(theta) * r, Math.sin(theta) * r, gauss(random) * 0.05, 0.2 + random() * 0.14)
    }
    return buffer
}

// --- 3 · Skills: a two-layer hexagonal lattice -------------------------------

const LATTICE_DEPTH = 0.2

/**
 * The 19 nodes of a hexagonal patch of a triangular lattice, front layer, in
 * the order the Skills widget lists its technologies: the centre, then for
 * each of the six sectors its inner node, its corner and its edge node. One
 * sector per technology family keeps a family's three nodes together.
 */
export const LATTICE_NODES: [number, number, number][] = (() => {
    const nodes: [number, number, number][] = [[0, 0, LATTICE_DEPTH]]
    for (let i = 0; i < 6; i++) {
        // Clockwise from the top-right, so the families read in order.
        const a = ((1 - i) * Math.PI) / 3
        const b = (-i * Math.PI) / 3
        nodes.push([Math.cos(a), Math.sin(a), LATTICE_DEPTH])
        nodes.push([2 * Math.cos(a), 2 * Math.sin(a), LATTICE_DEPTH])
        nodes.push([Math.cos(a) + Math.cos(b), Math.sin(a) + Math.sin(b), LATTICE_DEPTH])
    }
    return nodes
})()

function latticeEdges(): [number, number][] {
    const edges: [number, number][] = []
    for (let i = 0; i < LATTICE_NODES.length; i++) {
        for (let j = i + 1; j < LATTICE_NODES.length; j++) {
            const dx = LATTICE_NODES[i][0] - LATTICE_NODES[j][0]
            const dy = LATTICE_NODES[i][1] - LATTICE_NODES[j][1]
            if (Math.abs(Math.hypot(dx, dy) - 1) < 1e-3) edges.push([i, j])
        }
    }
    return edges
}

function buildSkills(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0x5c11)
    const n = count - dustCount
    const edges = latticeEdges()

    const shares = { front: 0.46, back: 0.2, nodes: 0.14, struts: 0.06 }
    const frontEnd = dustCount + Math.floor(n * shares.front)
    const backEnd = frontEnd + Math.floor(n * shares.back)
    const nodesEnd = backEnd + Math.floor(n * shares.nodes)
    const strutsEnd = nodesEnd + Math.floor(n * shares.struts)

    const along = (start: number, end: number, depth: number, lum: number) => {
        const span = end - start
        const perEdge = span / edges.length
        for (let i = start; i < end; i++) {
            const local = i - start
            const [a, b] = edges[local % edges.length]
            const t = (Math.floor(local / edges.length) + random() * 0.8) / perEdge
            const pa = LATTICE_NODES[a]
            const pb = LATTICE_NODES[b]
            write(
                buffer,
                i,
                pa[0] + (pb[0] - pa[0]) * t + gauss(random) * 0.008,
                pa[1] + (pb[1] - pa[1]) * t + gauss(random) * 0.008,
                depth + gauss(random) * 0.008,
                lum * (0.9 + random() * 0.2),
            )
        }
    }

    along(dustCount, frontEnd, LATTICE_DEPTH, 0.85)
    along(frontEnd, backEnd, -LATTICE_DEPTH, 0.38)

    for (let i = backEnd; i < nodesEnd; i++) {
        const node = LATTICE_NODES[(i - backEnd) % LATTICE_NODES.length]
        const theta = random() * Math.PI * 2
        const r = Math.pow(random(), 1.6) * 0.06
        write(buffer, i, node[0] + Math.cos(theta) * r, node[1] + Math.sin(theta) * r, node[2] + gauss(random) * 0.02, 1.45)
    }

    for (let i = nodesEnd; i < strutsEnd; i++) {
        const node = LATTICE_NODES[(i - nodesEnd) % LATTICE_NODES.length]
        const t = random()
        write(buffer, i, node[0], node[1], LATTICE_DEPTH - t * LATTICE_DEPTH * 2, 0.34)
    }

    // A faint disc around the lattice, so it sits in a field rather than on black.
    for (let i = strutsEnd; i < count; i++) {
        const theta = random() * Math.PI * 2
        const r = 1.2 + Math.pow(random(), 0.6) * 1.8
        write(buffer, i, Math.cos(theta) * r, Math.sin(theta) * r * 0.9, gauss(random) * 0.25, 0.16 + random() * 0.1)
    }
    return buffer
}

// --- 4 · Projects: a horizontal flow field -----------------------------------

/** Half the field's width; the shader wraps particles across it. */
export const FLOW_HALF_WIDTH = 17
const FLOW_LINES = 38

/**
 * Stored as (phase along the line, the line's resting height, depth, lum). The
 * shader advects x over time and recomputes y from it, so a particle stays on
 * its streamline while it flows.
 */
function buildProjects(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0xf10e)
    const n = count - dustCount
    const lineCount = Math.floor(n * 0.86)
    const perLine = lineCount / FLOW_LINES

    for (let j = 0; j < lineCount; j++) {
        const line = j % FLOW_LINES
        const k = Math.floor(j / FLOW_LINES)
        const y = -5.6 + (11.2 * line) / (FLOW_LINES - 1)
        const lineDepth = -2.8 + mulberry32(line * 7919 + 17)() * 3.4
        const x = -FLOW_HALF_WIDTH + ((k + random()) / perLine) * FLOW_HALF_WIDTH * 2
        const centre = 1 - Math.min(Math.abs(y) / 6, 1)
        write(buffer, dustCount + j, x, y + gauss(random) * 0.025, lineDepth + gauss(random) * 0.05, 0.38 + Math.pow(centre, 1.4) * 0.62)
    }

    for (let i = dustCount + lineCount; i < count; i++) {
        write(buffer, i, (random() - 0.5) * FLOW_HALF_WIDTH * 2, (random() - 0.5) * 12, -3 + random() * 3.5, 0.22 + random() * 0.2)
    }
    return buffer
}

// --- 5 · Experience: a wave field seen from just above -----------------------

export const WAVE_HALF_WIDTH = 17
const WAVE_NEAR = 4
const WAVE_FAR = -32

/** A flat grid on the XZ plane; the shader lifts every point into the swell. */
function buildExperience(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0x3a7e)
    const n = count - dustCount
    const width = WAVE_HALF_WIDTH * 2
    const depth = WAVE_NEAR - WAVE_FAR
    const cols = Math.max(12, Math.round(Math.sqrt((n * width) / depth)))
    const rows = Math.ceil(n / cols)

    for (let j = 0; j < n; j++) {
        const c = j % cols
        const r = Math.floor(j / cols)
        const x = -WAVE_HALF_WIDTH + ((c + (r % 2) * 0.5 + (random() - 0.5) * 0.3) / cols) * width
        const z = WAVE_NEAR - ((r + (random() - 0.5) * 0.3) / rows) * depth
        write(buffer, dustCount + j, x, 0, z, 0.8 + random() * 0.25)
    }
    return buffer
}

// --- 6 · Contact: a vortex with a dark core ----------------------------------

const VORTEX_ARMS = 5

/**
 * Stored in polar form (radius, angle, height, lum): the shader spins each
 * particle with an angular speed that falls off with radius, so the inner lip
 * turns faster than the rim and the arms wind tighter as they fall in.
 */
function buildContact(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0x0c0e)
    const n = count - dustCount
    const lipCount = Math.floor(n * 0.12)

    for (let j = 0; j < n; j++) {
        let r: number
        let theta: number
        if (j < lipCount) {
            r = VORTEX_INNER + Math.pow(random(), 2) * 0.1
            theta = random() * Math.PI * 2
        } else {
            const arm = j % VORTEX_ARMS
            r = VORTEX_INNER + Math.pow(random(), 1.3) * 3.6
            theta = (arm / VORTEX_ARMS) * Math.PI * 2 + Math.log(r) * 2.3 + gauss(random) * 0.2
        }
        const glow = Math.exp(-(r - VORTEX_INNER) / 0.95)
        write(buffer, dustCount + j, r, theta, gauss(random) * 0.05 * r, 0.3 + glow * 0.95)
    }
    return buffer
}

// --- 7 · Footer: everything let go -------------------------------------------

function buildFooter(count: number, dustCount: number): Float32Array {
    const buffer = withDust(count, dustCount)
    const random = mulberry32(0xf007)
    for (let i = dustCount; i < count; i++) {
        const bright = random() < 0.025
        write(buffer, i, gauss(random) * 7.5, gauss(random) * 4.2 + 0.4, gauss(random) * 3.2 - 2.5, bright ? 1.2 : 0.2 + random() * 0.3)
    }
    return buffer
}

// --- Seeds ------------------------------------------------------------------

function buildSeeds(count: number) {
    const random = mulberry32(0x5eed)
    const seed = new Float32Array(count * 4)
    const seed2 = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
        seed[i * 4] = random()
        seed[i * 4 + 1] = random()
        seed[i * 4 + 2] = random()
        seed[i * 4 + 3] = random()
        seed2[i * 4] = random()
        seed2[i * 4 + 1] = random()
        seed2[i * 4 + 2] = random()
        seed2[i * 4 + 3] = random()
    }
    return { seed, seed2 }
}

/** Hands the main thread back to the browser between two chunks of work. */
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

/**
 * Builds every formation, one per task. Building all seven in one go held
 * the main thread for a few hundred milliseconds while the Loader was on
 * screen, freezing its counter mid-count.
 */
export async function buildFormations(count: number): Promise<Formations> {
    const dustCount = Math.floor(count * DUST_SHARE)
    const hero = buildHero(count, dustCount)
    await nextTask()
    const about = buildAbout(count, dustCount)
    await nextTask()
    const skills = buildSkills(count, dustCount)
    await nextTask()
    const projects = buildProjects(count, dustCount)
    await nextTask()
    const experience = buildExperience(count, dustCount)
    await nextTask()
    const contact = buildContact(count, dustCount)
    await nextTask()
    const footer = buildFooter(count, dustCount)
    await nextTask()
    return { count, dustCount, hero, about, skills, projects, experience, contact, footer, ...buildSeeds(count) }
}
