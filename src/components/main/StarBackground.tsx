'use client'

import { PointMaterial, Points } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'
// @ts-expect-error - Módulo sin tipos
import * as random from 'maath/random/dist/maath-random.esm'

interface StarBackgroundProps {
    [key: string]: unknown
}

const StarBackground = (props: StarBackgroundProps) => {
    const ref = useRef<THREE.Points>(null)
    const [sphere, setSphere] = useState<Float32Array | null>(null)

    useEffect(() => {
        const positions = random.inSphere(new Float32Array(5000), { radius: 1.2 })

        for (let i = 0; i < positions.length; i++) {
            if (isNaN(positions[i])) {
                positions[i] = 0
            }
        }

        setSphere(positions)
    }, [])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 25
            ref.current.rotation.y -= delta / 30
        }
    })

    if (!sphere) return null

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
                <PointMaterial
                    transparent
                    color="#fff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

const StarsCanvas = () => (
    <div className="w-full h-auto fixed inset-0 z-[-1]">
        <Canvas camera={{ position: [0, 0, 1] }}>
            <Suspense fallback={null}>
                <StarBackground />
            </Suspense>
        </Canvas>
    </div>
)

export default StarsCanvas
