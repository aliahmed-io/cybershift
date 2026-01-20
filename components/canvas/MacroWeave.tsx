'use client'

import { useRef, useLayoutEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Mesh, TextureLoader, RepeatWrapping, Vector2, MeshStandardMaterial } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTexture } from '@react-three/drei'

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

export default function MacroWeave() {
    const meshRef = useRef<Mesh>(null)

    useLayoutEffect(() => {
        if (!meshRef.current) return

        // Ensure the DOM element exists before setting up trigger
        // We are looking for the #fabric-lab section defined in page.tsx
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '#fabric-lab',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5, // The "Scrub Lag" trick
                    pin: true,
                }
            })

            // Animation: "Dive" into the fabric
            if (meshRef.current) {
                // Pos & Rot
                tl.to(meshRef.current.position, {
                    z: 3,
                    y: 0,
                    ease: 'power2.inOut'
                }, 0)

                tl.to(meshRef.current.rotation, {
                    z: Math.PI / 4,
                    ease: 'none'
                }, 0)

                // Material Props
                if (meshRef.current.material instanceof MeshStandardMaterial) {
                    tl.to(meshRef.current.material, {
                        displacementScale: 0.5,
                        ease: 'power1.in'
                    }, 0)
                }
            }
        })

        return () => ctx.revert()
    }, [])

    return (
        <mesh
            ref={meshRef}
            position={[0, -5, -2]}
            rotation={[-Math.PI / 6, 0, 0]}
        >
            <planeGeometry args={[10, 10, 256, 256]} />
            {/* 
          Using MeshStandardMaterial with high roughness for fabric look.
          In a real app, strict 'map', 'normalMap', 'displacementMap' would be loaded.
          Here we simulate with wireframe or basic noise if texture not available.
      */}
            <meshStandardMaterial
                color="#1a1a1a"
                wireframe={false}
                roughness={0.9}
                metalness={0.1}
                displacementScale={0.0} // Starts flat
            />
        </mesh>
    )
}
