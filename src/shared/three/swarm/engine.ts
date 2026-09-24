import * as THREE from 'three'
import {
    BlendFunction,
    BloomEffect,
    EffectComposer,
    EffectPass,
    NoiseEffect,
    RenderPass,
    VignetteEffect,
    type Effect,
} from 'postprocessing'
import { tokens } from '@/shared/config/tokens'
import {
    buildFormations,
    HALO_OUTER,
    LATTICE_EXTENT,
    LATTICE_NODES,
    mulberry32,
    STAGE_ABOUT,
    STAGE_CONTACT,
    STAGE_EXPERIENCE,
    STAGE_FOOTER,
    STAGE_HERO,
    STAGE_PROJECTS,
    STAGE_SINGULARITY,
    STAGE_SKILLS,
    RING_RADIUS,
    VORTEX_INNER,
} from './formations'
import {
    backdropFragmentShader,
    backdropVertexShader,
    swarmFragmentShader,
    swarmVertexShader,
} from './shaders'
import {
    emitSkillNodes,
    getScrollProgress,
    getSwarmAnchor,
    getSwarmWordmark,
    markSwarmReady,
    swarmState,
    type SwarmAnchorName,
} from './store'

const FOV = 60
const BASE_Z = 8
const STAGES = 8
const TAN_HALF_FOV = Math.tan(((FOV / 2) * Math.PI) / 180)
/** The intro starts once this many frames have rendered: shaders and buffers are warm. */
const READY_AFTER_FRAMES = 4
/** Frozen clock for reduced motion: formations hold one pleasing pose. */
const REDUCED_MOTION_TIME = 7.3

// --- Tuning -------------------------------------------------------------------

/**
 * Per formation: brightness, point size, temperature, and how far its surface
 * swells in noise lobes.
 *
 * Temperature (0..1) slides the amber-over-blue gradient every formation is
 * painted with: 0.5 is the balanced split of the Hero's ring (amber crown,
 * violet flanks, blue base), lower is mostly blue, higher mostly amber. The
 * arc runs cool through Skills, warm from Projects to Contact, cool again at
 * the Footer.
 */
const LOOK = [
    // Blue and violet lead; amber is kept as an accent on the crowns.
    // (Previous, amber-heavier temperatures: 0.5, 0.5, 0.36, 0.3, 0.72, 0.78, 0.66, 0.3.)
    { gain: 1.5, size: 0.8, warm: 0.46, lobe: 0 }, // singularity
    { gain: 1.9, size: 1.0, warm: 0.47, lobe: 0 }, // hero
    { gain: 1.05, size: 0.95, warm: 0.3, lobe: 0 }, // about
    { gain: 1.0, size: 1.0, warm: 0.26, lobe: 0 }, // skills
    { gain: 0.85, size: 1.0, warm: 0.52, lobe: 0 }, // projects
    { gain: 0.95, size: 1.1, warm: 0.56, lobe: 0 }, // experience
    { gain: 1.05, size: 1.0, warm: 0.5, lobe: 0 }, // contact
    { gain: 0.85, size: 1.1, warm: 0.26, lobe: 0 }, // footer
] as const

type Vec3 = [number, number, number]

/**
 * Where the camera stands for each formation. Experience drops it to just
 * above the wave field and tilts it toward the horizon; everything anchored to
 * DOM content keeps the base pose, so the anchoring stays exact.
 */
const CAMERA: { position: Vec3; target: Vec3 }[] = [
    { position: [0, 0, BASE_Z], target: [0, 0, 0] },
    { position: [0, 0, BASE_Z], target: [0, 0, 0] },
    { position: [0, 0, BASE_Z], target: [0, 0, 0] },
    { position: [0, 0, BASE_Z], target: [0, 0, 0] },
    { position: [0, 0.35, BASE_Z + 0.6], target: [0, 0, 0] },
    { position: [0, -1.25, BASE_Z - 0.6], target: [0, -2.35, -6] },
    { position: [0, 0, BASE_Z], target: [0, 0, 0] },
    { position: [0, 0.2, BASE_Z + 1], target: [0, 0, 0] },
]

export const SWARM_TUNING = {
    /** Fraction of every transition spent staggering particles against each other. */
    stagger: 0.55,
    /** Curl-noise swirl added mid-flight, in world units. */
    flight: 0.85,
    /** Resting curl-noise drift, in world units. */
    curlAmp: 0.04,
    curlFreq: 0.34,
    curlSpeed: 0.07,
    /** Base point size in world units, before per-formation and per-particle scaling. */
    pointSize: 0.022,
    /** Depth of field: the focal distance, and how fast points blur away from it. */
    focus: BASE_Z,
    dof: 0.085,
    opacity: 0.78,
    dustGain: 0.34,
    singularity: 0.085,
    bloom: { threshold: 0.45, smoothing: 0.3, intensity: 1.5, radius: 0.72 },
    grainOpacity: 0.1,
    vignette: { offset: 0.3, darkness: 0.72 },
    mouse: { radius: 0.3, strength: 1, parallax: 0.32 },
    backdropStrength: 0.02,
} as const

// --- Helpers --------------------------------------------------------------------

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
    return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

export function selectParticleCount(): number {
    if (typeof window === 'undefined') return 60000
    if (window.innerWidth < 768) return 18000
    const cores = navigator.hardwareConcurrency ?? 8
    return cores <= 4 ? 36000 : 60000
}

type AnchorBox = { x: number; y: number; w: number; h: number; rect: DOMRect }

export type SwarmSnapshot = {
    progress: number
    coordinate: number
    camera: Vec3
    target: Vec3
    offsets: Vec3[]
    scales: number[]
    labelVisibility: number
    burst: number
    intro: number
    faceStrength: number
    pixelRatio: number
}

/**
 * The whole WebGL layer, in plain Three.js: one fixed full-viewport canvas,
 * one point cloud, one backdrop, one post-processing chain, and its own
 * render loop.
 *
 * Every frame is computed from three inputs only — the scroll-derived
 * formation coordinate, the clock, and the pointer — plus the DOM boxes the
 * formations are anchored to. There is no per-frame accumulation of any kind
 * (the pointer's smoothing is input filtering, not scene state), which is what
 * makes every scroll-driven transition reversible frame for frame.
 */
export class SwarmEngine {
    private readonly renderer: THREE.WebGLRenderer
    private readonly scene = new THREE.Scene()
    private readonly camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120)
    private readonly composer: EffectComposer
    private readonly geometry = new THREE.BufferGeometry()
    private readonly material: THREE.ShaderMaterial
    private readonly backdrop: THREE.ShaderMaterial
    private readonly count: number
    private readonly reducedMotion: boolean
    private readonly finePointer: boolean
    private readonly start = performance.now()

    private width = 1
    private disposed = false
    private height = 1
    private worldW = 1
    private worldH = 1
    private lastFrame = performance.now()
    private wordmarkVersion = 0
    private coordinate = 1
    private labelVisibility = 0
    /** Frames rendered so far; the intro waits for the first few. */
    private framesRendered = 0

    private readonly pointer = { x: 0, y: 0, inside: false }
    private readonly smoothPointer = { x: 0, y: 0, strength: 0 }
    private readonly cameraTarget = new THREE.Vector3()
    private readonly nodePoints = new Float32Array(LATTICE_NODES.length * 3)
    private readonly scratch = {
        m4: new THREE.Matrix4(),
        rx: new THREE.Matrix4(),
        ry: new THREE.Matrix4(),
        rz: new THREE.Matrix4(),
        spin: new THREE.Matrix4(),
        v: new THREE.Vector3(),
        buffer: new THREE.Vector2(),
        cool: new THREE.Color(tokens.cool),
        coolDeep: new THREE.Color(tokens.coolDeep),
        warm: new THREE.Color(tokens.warm),
        warmDeep: new THREE.Color(tokens.warmDeep),
        violet: new THREE.Color(tokens.violet),
    }

    private readonly uniforms: Record<string, THREE.IUniform>

    /**
     * Every formation's placement, recomputed each frame on the CPU. Only the
     * two the swarm is currently between are copied into the shader.
     */
    private readonly stageRot = Array.from({ length: STAGES }, () => new THREE.Matrix3())
    private readonly stageOffset = Array.from({ length: STAGES }, () => new THREE.Vector3())
    private readonly stageScale = new Array<number>(STAGES).fill(1)

    constructor(canvas: HTMLCanvasElement, options: { reducedMotion: boolean }) {
        this.reducedMotion = options.reducedMotion
        this.finePointer = window.matchMedia('(pointer: fine)').matches && !options.reducedMotion
        this.count = selectParticleCount()

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: false,
            depth: false,
            stencil: false,
            powerPreference: 'high-performance',
        })
        this.renderer.setClearColor(tokens.bg, 1)


        const t = SWARM_TUNING
        this.uniforms = {
            uStageA: { value: 1 },
            uStageB: { value: 2 },
            uFrac: { value: 0 },
            uReducedFade: { value: 1 },
            uIntro: { value: 1 },
            uTime: { value: 0 },
            uStagger: { value: t.stagger },
            uFlight: { value: this.reducedMotion ? 0 : t.flight },
            uCurlAmp: { value: this.reducedMotion ? 0 : t.curlAmp },
            uCurlFreq: { value: t.curlFreq },
            uCurlSpeed: { value: t.curlSpeed },
            uSingularity: { value: t.singularity },
            uDustGain: { value: t.dustGain },
            uRotA: { value: new THREE.Matrix3() },
            uRotB: { value: new THREE.Matrix3() },
            uOffsetA: { value: new THREE.Vector3() },
            uOffsetB: { value: new THREE.Vector3() },
            uScaleA: { value: 1 },
            uScaleB: { value: 1 },
            uGainA: { value: 1 },
            uGainB: { value: 1 },
            uSizeA: { value: 1 },
            uSizeB: { value: 1 },
            uWarmA: { value: 0.5 },
            uWarmB: { value: 0.5 },
            uLobeA: { value: 0 },
            uLobeB: { value: 0 },
            uCool: { value: this.scratch.cool },
            uCoolDeep: { value: this.scratch.coolDeep },
            uWarmTone: { value: this.scratch.warm },
            uWarmDeep: { value: this.scratch.warmDeep },
            uViolet: { value: this.scratch.violet },
            uPointSize: { value: t.pointSize },
            uPixelScale: { value: 400 },
            uDensity: { value: Math.min(Math.sqrt(60000 / this.count), 1.3) },
            uOpacity: { value: t.opacity },
            uMouse: { value: new THREE.Vector2(9, 9) },
            uMouseStrength: { value: 0 },
            uMouseRadius: { value: t.mouse.radius },
            uAspect: { value: 1 },
            uFace: { value: new THREE.Vector4(9, 9, 0.1, 0.1) },
            uFaceStrength: { value: 0 },
            uFocus: { value: t.focus },
            uDof: { value: t.dof },
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: swarmVertexShader,
            fragmentShader: swarmFragmentShader,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
        })

        const points = new THREE.Points(this.geometry, this.material)
        // The bounding sphere comes from `position`, which only holds the
        // wordmark; every formation lives outside it.
        points.frustumCulled = false
        this.scene.add(points)

        this.backdrop = new THREE.ShaderMaterial({
            uniforms: {
                uBase: { value: new THREE.Color(tokens.bg) },
                uGlow: { value: new THREE.Color() },
                uGlowDeep: { value: new THREE.Color() },
                uAspect: { value: 1 },
                uTime: { value: 0 },
                uStrength: { value: t.backdropStrength },
            },
            vertexShader: backdropVertexShader,
            fragmentShader: backdropFragmentShader,
            depthTest: false,
            depthWrite: false,
        })
        const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.backdrop)
        backdrop.frustumCulled = false
        backdrop.renderOrder = -1
        this.scene.add(backdrop)

        this.composer = new EffectComposer(this.renderer, { frameBufferType: THREE.HalfFloatType, multisampling: 0 })
        this.composer.addPass(new RenderPass(this.scene, this.camera))

        const bloom = new BloomEffect({
            mipmapBlur: true,
            luminanceThreshold: t.bloom.threshold,
            luminanceSmoothing: t.bloom.smoothing,
            intensity: t.bloom.intensity,
            radius: t.bloom.radius,
        })
        const effects: Effect[] = [bloom]
        // Grain costs a full-screen pass and reads as dirt on a small screen.
        if (window.innerWidth >= 768) {
            // Premultiplied: the grain scales with the light under it, so the
            // black stays black and only the swarm gets texture.
            const grain = new NoiseEffect({ blendFunction: BlendFunction.SCREEN, premultiply: true })
            grain.blendMode.opacity.value = t.grainOpacity
            effects.push(grain)
        }
        effects.push(new VignetteEffect({ offset: t.vignette.offset, darkness: t.vignette.darkness }))
        this.composer.addPass(new EffectPass(this.camera, ...effects))

        this.resize()
        window.addEventListener('resize', this.resize)
        if (this.finePointer) {
            window.addEventListener('pointermove', this.onPointerMove, { passive: true })
            document.documentElement.addEventListener('pointerleave', this.onPointerLeave)
        }

        void this.boot()
    }

    /**
     * The heavy part of start-up, kept off the critical path: the formations
     * are built a chunk per task, and the shaders compile in parallel
     * (KHR_parallel_shader_compile, via compileAsync) instead of blocking.
     * Done synchronously, the two held the main thread for most of a second
     * while the Loader was animating. The loop starts once both are ready.
     */
    private async boot() {
        const formations = await buildFormations(this.count)
        if (this.disposed) return

        const attribute = (array: Float32Array, size: number) => new THREE.BufferAttribute(array, size)
        this.geometry.setAttribute('position', attribute(new Float32Array(this.count * 3), 3))
        this.geometry.setAttribute('aHero', attribute(formations.hero, 4))
        this.geometry.setAttribute('aAbout', attribute(formations.about, 4))
        this.geometry.setAttribute('aSkills', attribute(formations.skills, 4))
        this.geometry.setAttribute('aProjects', attribute(formations.projects, 4))
        this.geometry.setAttribute('aExperience', attribute(formations.experience, 4))
        this.geometry.setAttribute('aContact', attribute(formations.contact, 4))
        this.geometry.setAttribute('aFooter', attribute(formations.footer, 4))
        this.geometry.setAttribute('aSeed', attribute(formations.seed, 4))
        this.geometry.setAttribute('aSeed2', attribute(formations.seed2, 4))

        // Compile against the target the scene is actually drawn into (the
        // composer's linear HDR buffer): a program compiled for the canvas is
        // a different variant, and the real one would still compile, blocking,
        // on the first frame.
        const composerTarget = (this.composer as unknown as { inputBuffer?: THREE.WebGLRenderTarget }).inputBuffer ?? null
        this.renderer.setRenderTarget(composerTarget)
        await this.renderer.compileAsync(this.scene, this.camera)
        this.renderer.setRenderTarget(null)
        if (this.disposed) return
        await this.precompilePostprocessing(composerTarget)
        if (this.disposed) return
        this.lastFrame = performance.now()
        this.renderer.setAnimationLoop(this.frame)
    }

    /**
     * The post-processing chain (bloom, grain, vignette) renders through its
     * own full-screen materials, which compileAsync never sees; left alone
     * they compile synchronously on the first frame, which held the main
     * thread for most of a second on a cold shader cache. Gathering them onto
     * throwaway quads lets the driver compile them in parallel too.
     */
    private async precompilePostprocessing(target: THREE.WebGLRenderTarget | null) {
        const materials = new Set<THREE.Material>()
        const seen = new Set<object>()
        const collect = (value: unknown, depth: number) => {
            if (!value || typeof value !== 'object' || seen.has(value) || depth > 4) return
            seen.add(value)
            if (value instanceof THREE.Material) {
                materials.add(value)
                return
            }
            if (value instanceof THREE.WebGLRenderer || value instanceof THREE.Texture || value instanceof THREE.WebGLRenderTarget) return
            for (const child of Object.values(value)) collect(child, depth + 1)
        }
        collect(this.composer.passes, 0)

        const warm = new THREE.Scene()
        const quad = new THREE.PlaneGeometry(2, 2)
        materials.forEach((material) => {
            const mesh = new THREE.Mesh(quad, material)
            mesh.frustumCulled = false
            warm.add(mesh)
        })
        try {
            // Both variants: the effect chain's passes draw into render targets,
            // and its last pass draws to the canvas.
            this.renderer.setRenderTarget(target)
            await this.renderer.compileAsync(warm, this.camera)
            this.renderer.setRenderTarget(null)
            await this.renderer.compileAsync(warm, this.camera)
        } catch {
            // Best effort: anything not compiled here compiles on first use.
        } finally {
            this.renderer.setRenderTarget(null)
        }
        quad.dispose()
    }

    dispose() {
        this.disposed = true
        this.renderer.setAnimationLoop(null)
        window.removeEventListener('resize', this.resize)
        window.removeEventListener('pointermove', this.onPointerMove)
        document.documentElement.removeEventListener('pointerleave', this.onPointerLeave)
        this.geometry.dispose()
        this.material.dispose()
        this.backdrop.dispose()
        this.composer.dispose()
        this.renderer.dispose()
    }

    /** Scroll-derived state only, for checking that transitions reverse exactly. */
    snapshot(): SwarmSnapshot {
        const round = (value: number) => Math.round(value * 1000) / 1000
        const vec = (v: THREE.Vector3): Vec3 => [round(v.x), round(v.y), round(v.z)]
        return {
            progress: round(getScrollProgress()),
            coordinate: round(this.coordinate),
            camera: vec(this.camera.position),
            target: vec(this.cameraTarget),
            offsets: this.stageOffset.map(vec),
            scales: this.stageScale.map(round),
            labelVisibility: round(this.labelVisibility),
            burst: round(swarmState.burst),
            intro: round(swarmState.intro),
            faceStrength: this.uniforms.uFaceStrength.value as number,
            pixelRatio: this.renderer.getPixelRatio(),
        }
    }

    /**
     * Sized to the canvas box (100lvh), not to window.innerHeight: on phones the
     * address bar showing and hiding changes innerHeight on every scroll, and
     * resizing the drawing buffer blanks the canvas for a frame. The pixel
     * ratio is chosen here, from the screen size, and never changes mid-visit:
     * a live resolution change is itself a visible cut.
     */
    private readonly resize = () => {
        const canvas = this.renderer.domElement
        const width = canvas.clientWidth || window.innerWidth
        const height = canvas.clientHeight || window.innerHeight
        if (width === this.width && height === this.height) return
        this.width = width
        this.height = height
        // DPR in [1, 2], capped so the post-processing buffers stay near 4 MP.
        const ratio = Math.max(1, Math.min(window.devicePixelRatio, 2, Math.sqrt(4.2e6 / (width * height))))
        this.renderer.setPixelRatio(ratio)
        this.renderer.setSize(this.width, this.height, false)
        this.composer.setSize(this.width, this.height, false)
        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

        this.worldH = 2 * BASE_Z * TAN_HALF_FOV
        this.worldW = this.worldH * this.camera.aspect

        const buffer = this.renderer.getDrawingBufferSize(this.scratch.buffer)
        this.uniforms.uPixelScale.value = buffer.y * 0.5
        this.uniforms.uAspect.value = this.camera.aspect
        this.backdrop.uniforms.uAspect.value = this.camera.aspect
    }

    private readonly onPointerMove = (event: PointerEvent) => {
        this.pointer.x = (event.clientX / this.width) * 2 - 1
        this.pointer.y = -(event.clientY / this.height) * 2 + 1
        this.pointer.inside = true
    }

    private readonly onPointerLeave = () => {
        this.pointer.inside = false
    }

    private readonly frame = () => {
        const now = performance.now()
        const delta = Math.min((now - this.lastFrame) / 1000, 0.1)
        this.lastFrame = now
        const time = this.reducedMotion ? REDUCED_MOTION_TIME : (now - this.start) / 1000

        this.syncWordmark()

        const progress = getScrollProgress()
        const burst = this.reducedMotion ? 1 : swarmState.burst
        const u = this.uniforms
        u.uIntro.value = this.reducedMotion ? 1 : swarmState.intro
        u.uTime.value = time
        this.backdrop.uniforms.uTime.value = time

        // One coordinate for everything: the shader's formations, the camera,
        // the backdrop's temperature, the labels' visibility.
        const coordinate = this.reducedMotion ? Math.round(progress) : Math.min(Math.max(progress * burst, 0), STAGES - 1)
        this.coordinate = coordinate

        this.placeStages(time)
        this.bindStages(coordinate, progress)
        this.placeCamera(coordinate, delta)
        this.tintBackdrop(coordinate)
        this.placeFace()
        this.projectSkillNodes(coordinate)

        this.composer.render(delta)

        this.framesRendered += 1
        if (this.framesRendered === READY_AFTER_FRAMES) markSwarmReady()
    }

    private syncWordmark() {
        const { points, version } = getSwarmWordmark()
        if (!points || version === this.wordmarkVersion) return
        this.wordmarkVersion = version

        // Screen pixels to world units on the z = 0 plane, as the base camera
        // sees it. Seeded jitter keeps particles sharing a sampled pixel apart.
        const position = this.geometry.getAttribute('position') as THREE.BufferAttribute
        const array = position.array as Float32Array
        const random = mulberry32(0x3017)
        const sampleCount = points.length / 2
        const pixel = this.worldH / this.height
        for (let i = 0; i < this.count; i++) {
            const s = i % sampleCount
            array[i * 3] = (points[s * 2] / this.width - 0.5) * this.worldW + (random() - 0.5) * pixel
            array[i * 3 + 1] = -(points[s * 2 + 1] / this.height - 0.5) * this.worldH + (random() - 0.5) * pixel
            array[i * 3 + 2] = (random() - 0.5) * 0.12
        }
        position.needsUpdate = true
    }

    private anchor(name: SwarmAnchorName): AnchorBox | null {
        const element = getSwarmAnchor(name)
        if (!element) return null
        const rect = element.getBoundingClientRect()
        if (rect.width < 1 || rect.height < 1) return null
        return {
            x: ((rect.left + rect.width / 2) / this.width - 0.5) * this.worldW,
            y: -((rect.top + rect.height / 2) / this.height - 0.5) * this.worldH,
            w: (rect.width / this.width) * this.worldW,
            h: (rect.height / this.height) * this.worldH,
            rect,
        }
    }

    /** Rz(roll) · Ry(yaw) · Rx(tilt) · Rz(spin): spin about the formation's own axis, then tilt it into place. */
    private setStage(index: number, offset: Vec3, scale: number, spin: number, tilt: number, yaw: number, roll: number) {
        const s = this.scratch
        s.m4.makeRotationZ(roll)
        s.m4.multiply(s.ry.makeRotationY(yaw))
        s.m4.multiply(s.rx.makeRotationX(tilt))
        s.m4.multiply(s.spin.makeRotationZ(spin))
        this.stageRot[index].setFromMatrix4(s.m4)
        this.stageOffset[index].set(offset[0], offset[1], offset[2])
        this.stageScale[index] = scale
    }

    private placeStages(time: number) {
        const W = this.worldW
        const H = this.worldH

        this.setStage(STAGE_SINGULARITY, [0, 0, 0], 1, 0, 0, 0, 0)

        // Face-on and huge: the ring frames the headline and runs off the top
        // and bottom of a landscape screen; on a phone it hugs the width.
        const hero = this.anchor('hero')
        const heroRadius = hero ? Math.min(hero.h * 0.5, hero.w * 0.6) : Math.min(H * 0.5, W * 0.6)
        this.setStage(
            STAGE_HERO,
            hero ? [hero.x, hero.y, 0] : [0, 0, 0],
            heroRadius / RING_RADIUS,
            time * 0.035,
            0.16 * Math.sin(time * 0.13),
            0.12 * Math.sin(time * 0.11),
            0,
        )

        const about = this.anchor('about')
        this.setStage(
            STAGE_ABOUT,
            about ? [about.x, about.y, 0] : [-W * 0.22, -H * 0.05, 0],
            about ? about.w / (2 * HALO_OUTER) : H * 0.2,
            time * 0.16,
            -1.24,
            0.08,
            -0.07,
        )

        // On a narrow screen the lattice turns 30° (pointy side up): nodes that
        // share a row are then √3 apart instead of 1, which is the room a
        // technology's name needs next to its node on a phone. It also sways
        // less there, so the labels riding it stay readable.
        const skills = this.anchor('skills')
        const narrow = this.width < 768
        this.setStage(
            STAGE_SKILLS,
            skills ? [skills.x, skills.y, 0] : [W * 0.18, 0, 0],
            skills ? Math.min(skills.w, skills.h) / (2 * LATTICE_EXTENT) : H * 0.14,
            (narrow ? 0.04 : 0.1) * Math.sin(time * 0.06),
            -0.2 + 0.07 * Math.sin(time * 0.08),
            (narrow ? 0.14 : 0.3) * Math.sin(time * 0.1),
            narrow ? Math.PI / 6 : 0,
        )

        this.setStage(STAGE_PROJECTS, [0, 0, -1.8], 1, 0, 0.08, 0, -0.05)
        // Already authored on the XZ plane: the swell lifts it along Y.
        this.setStage(STAGE_EXPERIENCE, [0, -2.85, 0], 1, 0, 0, 0, 0)

        const contact = this.anchor('contact')
        this.setStage(
            STAGE_CONTACT,
            contact ? [contact.x, contact.y, 0] : [0, 0, 0],
            contact ? contact.w / (2 * VORTEX_INNER) : W * 0.2,
            0,
            -0.92 + 0.04 * Math.sin(time * 0.15),
            0.05 * Math.sin(time * 0.11),
            0,
        )

        // The footer breathes: a slow swell of the whole ambient cloud.
        this.setStage(STAGE_FOOTER, [0, 0, 0], 1 + 0.035 * Math.sin(time * 0.5), time * 0.012, 0, 0, 0)
    }

    /**
     * Splits the coordinate into the two formations it lies between and the
     * fraction along, and hands the shader exactly those two placements.
     * Computed here, once, in double precision: the shader never works out
     * which formation it is in, so it can never disagree with the CPU about
     * it at a boundary.
     */
    private bindStages(coordinate: number, progress: number) {
        const u = this.uniforms
        let a: number
        let frac: number
        if (this.reducedMotion) {
            // No morphing: hold one formation, and fade the pool out and back
            // in around the midpoint between sections, where the swap happens.
            a = Math.min(Math.round(progress), STAGES - 1)
            frac = 0
            u.uReducedFade.value = smoothstep(0.02, 0.16, Math.abs((progress % 1) - 0.5))
        } else {
            a = Math.min(Math.floor(coordinate), STAGES - 2)
            frac = coordinate - a
            u.uReducedFade.value = 1
        }
        const b = Math.min(a + 1, STAGES - 1)

        u.uStageA.value = a
        u.uStageB.value = b
        u.uFrac.value = frac
        ;(u.uRotA.value as THREE.Matrix3).copy(this.stageRot[a])
        ;(u.uRotB.value as THREE.Matrix3).copy(this.stageRot[b])
        ;(u.uOffsetA.value as THREE.Vector3).copy(this.stageOffset[a])
        ;(u.uOffsetB.value as THREE.Vector3).copy(this.stageOffset[b])
        u.uScaleA.value = this.stageScale[a]
        u.uScaleB.value = this.stageScale[b]
        u.uGainA.value = LOOK[a].gain
        u.uGainB.value = LOOK[b].gain
        u.uSizeA.value = LOOK[a].size
        u.uSizeB.value = LOOK[b].size
        u.uWarmA.value = LOOK[a].warm
        u.uWarmB.value = LOOK[b].warm
        u.uLobeA.value = this.reducedMotion ? 0 : LOOK[a].lobe
        u.uLobeB.value = this.reducedMotion ? 0 : LOOK[b].lobe
    }

    private placeCamera(coordinate: number, delta: number) {
        const i0 = Math.min(Math.floor(coordinate), STAGES - 2)
        const f = smoothstep(0, 1, coordinate - i0)
        const from = CAMERA[i0]
        const to = CAMERA[i0 + 1]

        // Pointer input is filtered (lerped toward the latest sample) before it
        // touches anything, so the parallax glides instead of jittering.
        const p = this.smoothPointer
        const follow = 1 - Math.exp(-3.2 * delta)
        if (this.finePointer) {
            p.x += (this.pointer.x - p.x) * follow
            p.y += (this.pointer.y - p.y) * follow
            p.strength += ((this.pointer.inside ? 1 : 0) - p.strength) * (1 - Math.exp(-2 * delta))
        }

        const parallax = SWARM_TUNING.mouse.parallax * p.strength
        this.camera.position.set(
            lerp(from.position[0], to.position[0], f) + p.x * parallax,
            lerp(from.position[1], to.position[1], f) + p.y * parallax * 0.6,
            lerp(from.position[2], to.position[2], f),
        )
        this.cameraTarget.set(
            lerp(from.target[0], to.target[0], f),
            lerp(from.target[1], to.target[1], f),
            lerp(from.target[2], to.target[2], f),
        )
        this.camera.lookAt(this.cameraTarget)
        this.camera.updateMatrixWorld()

        this.uniforms.uMouse.value.set(p.x, p.y)
        this.uniforms.uMouseStrength.value = this.finePointer ? p.strength * SWARM_TUNING.mouse.strength : 0
    }

    private tintBackdrop(coordinate: number) {
        const i0 = Math.min(Math.floor(coordinate), STAGES - 2)
        const warm = lerp(LOOK[i0].warm, LOOK[i0 + 1].warm, smoothstep(0, 1, coordinate - i0))
        const s = this.scratch
        ;(this.backdrop.uniforms.uGlow.value as THREE.Color).copy(s.cool).lerp(s.warm, warm)
        ;(this.backdrop.uniforms.uGlowDeep.value as THREE.Color).copy(s.coolDeep).lerp(s.warmDeep, warm)
    }

    private placeFace() {
        // Always on while the portrait exists. Toggling it when the face
        // enters the screen made the particles around it pop out in one frame;
        // an ellipse that is off screen simply affects nothing.
        const face = this.anchor('face')
        if (!face) {
            this.uniforms.uFaceStrength.value = 0
            return
        }
        const { rect } = face
        ;(this.uniforms.uFace.value as THREE.Vector4).set(
            ((rect.left + rect.width / 2) / this.width) * 2 - 1,
            -(((rect.top + rect.height / 2) / this.height) * 2 - 1),
            rect.width / this.width,
            rect.height / this.height,
        )
        this.uniforms.uFaceStrength.value = 1
    }

    /**
     * Projects the lattice's 19 front nodes to the screen so the Skills widget
     * can pin a technology to each one. Visibility is a function of the
     * formation coordinate, like everything else.
     */
    private projectSkillNodes(coordinate: number) {
        // Emitted every frame, visible or not: the labels' state must be a
        // function of the current frame only, never of what was on screen
        // before. Nineteen projections are nothing next to the frame itself.
        // Tight window: the labels only show while the lattice under them is
        // (nearly) formed, so text and nodes always coincide.
        const visibility = 1 - smoothstep(0.1, 0.35, Math.abs(coordinate - STAGE_SKILLS))
        this.labelVisibility = visibility

        const skills = this.anchor('skills')
        if (!skills) return

        const rot = this.stageRot[STAGE_SKILLS]
        const offset = this.stageOffset[STAGE_SKILLS]
        const scale = this.stageScale[STAGE_SKILLS]
        const v = this.scratch.v

        LATTICE_NODES.forEach((node, i) => {
            v.set(node[0] * scale, node[1] * scale, node[2] * scale).applyMatrix3(rot).add(offset)
            const depth = v.z
            v.project(this.camera)
            this.nodePoints[i * 3] = ((v.x + 1) / 2) * this.width - skills.rect.left
            this.nodePoints[i * 3 + 1] = ((1 - v.y) / 2) * this.height - skills.rect.top
            this.nodePoints[i * 3 + 2] = Math.min(Math.max(0.5 + depth / (scale * 2 + 1e-4), 0), 1)
        })

        emitSkillNodes({ points: this.nodePoints, visibility })
    }
}
