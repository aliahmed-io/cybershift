'use client'

import { useRef, useLayoutEffect } from 'react'
import { View, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { Mesh, Group } from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function FabricMesh({ rotationSpeed = 1, ...props }: any) {
    const meshRef = useRef<Mesh>(null)

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        // Scroll interaction: Rotate as user scrolls past the section
        gsap.to(meshRef.current.rotation, {
            y: Math.PI * 2 * rotationSpeed,
            scrollTrigger: {
                trigger: '#fabric-lab',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        })
    }, [rotationSpeed])

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} {...props}>
            <planeGeometry args={[10, 10, 64, 64]} />
            <meshStandardMaterial
                color="#0a0a0a"
                roughness={0.4}
                metalness={0.6}
            />
            <ambientLight intensity={1} />
            <spotLight position={[5, 10, 5]} intensity={50} />
        </mesh>
    )
}

export default function FabricLabViews({ viewRefs }: { viewRefs: any }) {
    // Safety check - if refs aren't ready yet or passed incorrectly
    if (!viewRefs) return null

    return (
        <>
            {/* View 1: Sleeve */}
            <View track={viewRefs.view1}>
                <color attach="background" args={['#e0e0e0']} />
                <group position={[0, -1, 0]}>
                    <mesh rotation={[0, 0, 0]}>
                        <capsuleGeometry args={[0.8, 2, 8, 16]} />
                        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
                    </mesh>
                    <ambientLight intensity={2} />
                    <pointLight position={[10, 10, 10]} />
                </group>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
                <OrbitControls enableZoom={false} enablePan={false} />
            </View>

            {/* View 2: Grain */}
            <View track={viewRefs.view2}>
                <color attach="background" args={['#ffffff']} />
                <FabricMesh scale={[0.8, 0.8, 0.8]} rotationSpeed={0.5} />
                <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={30} />
                <OrbitControls enableZoom={false} />
            </View>

            {/* View 3: Fiber */}
            <View track={viewRefs.view3}>
                <color attach="background" args={['#f0f0f0']} />
                {/* Macro view - simulated with wireframe/noise */}
                <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, 0]}>
                    <planeGeometry args={[5, 5, 64, 64]} />
                    <meshStandardMaterial color="#39ff14" wireframe={true} emissive="#39ff14" emissiveIntensity={0.2} />
                </mesh>
                <PerspectiveCamera makeDefault position={[0, 0, 1.8]} fov={20} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </View>
        </>
    )
}
