'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame, extend, ThreeEvent } from '@react-three/fiber'
import { Vector2, Color, Vector3 } from 'three'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'

const MAX_PULSES = 10

// --- Custom Shader Material ---
const ClothMaterial = shaderMaterial(
    {
        uTime: 0,
        uPulsePositions: new Array(MAX_PULSES).fill(new Vector2(-10, -10)),
        uPulseTimes: new Array(MAX_PULSES).fill(0),
        uPulseDuration: 2.0,
        uColor: new Color('#39ff14'),
    },
    // vertex shader
    `
    uniform float uTime;
    uniform vec2 uPulsePositions[${MAX_PULSES}];
    uniform float uPulseTimes[${MAX_PULSES}];
    uniform float uPulseDuration;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Base Wave
      float wave = sin(uv.x * 10.0 + uTime * 1.5) * 0.1;
      wave += cos(uv.y * 8.0 + uTime * 1.8) * 0.1;

      // Additive Pulses
      for (int i = 0; i < ${MAX_PULSES}; i++) {
        float tStart = uPulseTimes[i];
        if (tStart > 0.0) {
            float age = uTime - tStart;
            if (age > 0.0 && age < uPulseDuration) {
                float dist = distance(uv, uPulsePositions[i]);
                // Ring ripple
                float ripple = sin(dist * 20.0 - age * 10.0);
                float fade = 1.0 - (age / uPulseDuration);
                float mask = smoothstep(0.5, 0.0, abs(dist - age * 0.5)); // Expand ring
                
                pos.z += ripple * fade * mask * 0.3;
            }
        }
      }

      pos.z += wave;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // fragment shader
    `
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      // Simple Fresnel
      float fresnel = pow(1.0 - abs(dot(normalize(vec3(0.0,0.0,1.0)), vec3(0.0,0.0,1.0))), 2.5);
      gl_FragColor = vec4(uColor * fresnel, 1.0);
    }
  `
)

extend({ ClothMaterial })

declare global {
    namespace JSX {
        interface IntrinsicElements {
            clothMaterial: any
        }
    }
}

export default function HeroClothInteractive() {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<any>(null)

    // State for multiple pulses
    const [pulseIndex, setPulseIndex] = useState(0)
    // We use refs for the arrays to avoid re-renders on every click, 
    // but we modify them and update uniforms in useFrame
    const pulsePositions = useRef(new Array(MAX_PULSES).fill(new Vector2(-10, -10)))
    const pulseTimes = useRef(new Array(MAX_PULSES).fill(-10.0))

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.getElapsedTime()

            // Update Uniforms
            // Note: R3F shaderMaterial might need explicit update for arrays if reference doesn't change
            // But passing the ref content usually works if mutated correctly or copied.
            // Safest is to copy or ensure shader uses the updated values.
            materialRef.current.uPulsePositions = pulsePositions.current
            materialRef.current.uPulseTimes = pulseTimes.current
        }
    })

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (!materialRef.current || !e.uv) return

        // Add new pulse at current index
        const now = materialRef.current.uTime
        pulsePositions.current[pulseIndex] = e.uv.clone()
        pulseTimes.current[pulseIndex] = now

        // Cycle index
        setPulseIndex((prev) => (prev + 1) % MAX_PULSES)
    }

    return (
        <mesh
            ref={meshRef}
            onClick={handleClick}
            position={[0, 0, 0]}
            rotation={[-0.1, 0, 0]}
        >
            <planeGeometry args={[14, 10, 80, 60]} />
            <clothMaterial ref={materialRef} side={THREE.DoubleSide} transparent />
        </mesh>
    )
}
