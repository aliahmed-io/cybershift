'use client'

import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, AdaptiveEvents, View } from '@react-three/drei'
import { Suspense } from 'react'
import { Physics } from '@react-three/cannon'

export default function Scene({ children, ...props }: any) {
    return (
        <Canvas {...props} gl={{ alpha: true }} style={{ pointerEvents: 'none' }} shadows>
            {/* Global Lighting */}
            <directionalLight
                intensity={1.5}
                position={[5, 10, 5]}
                castShadow
            />
            <ambientLight intensity={0.7} />

            <Suspense fallback={null}>
                <Physics gravity={[0, -5, 0]}>
                    {children}
                </Physics>
                <Preload all />
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
            </Suspense>
        </Canvas>
    )
}
