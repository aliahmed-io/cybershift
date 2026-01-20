'use client'

import React, { useRef } from 'react'
import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })
const HeroCloth = dynamic(() => import('@/components/canvas/HeroCloth'), { ssr: false })
const FabricLabViews = dynamic(() => import('@/components/canvas/FabricLabViews'), { ssr: false })
const LookbookDOM = dynamic(() => import('@/components/dom/LookbookDOM'), { ssr: false })

import { View } from '@react-three/drei'

export default function Page() {
  const view1Ref = useRef<HTMLDivElement>(null)
  const view2Ref = useRef<HTMLDivElement>(null)
  const view3Ref = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null) // Ref for Hero Grid

  // Stable ref for R3F event source
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <main className="w-full min-h-screen bg-white text-black selection:bg-neon-green selection:text-black">
      {/* 
         3D Layer: Z-INDEX 0
         It sits at the bottom.
         The DOM layer (Z-10) sits on top and acts as the event source.
         R3F listens to events on the containerRef and correctly raycasts.
      */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
        <Scene eventSource={containerRef} className="pointer-events-none">
          {/* Hero View */}
          <View track={heroRef as any} index={1}>
            <HeroCloth />
            {/* Relying on global Scene lights to avoid washing out the neon effect */}
          </View>

          <FabricLabViews viewRefs={{ view1: view1Ref, view2: view2Ref, view3: view3Ref }} />
        </Scene>
      </div>

      {/* DOM Layer: Z-INDEX 10 - Acts as Event Source */}
      <div
        ref={containerRef}
        className="relative z-10 w-full"
        id="root"
      >

        {/* Section 1: Hero */}
        <section ref={heroRef} className="h-screen w-full flex items-center justify-center">
          <div className="text-center z-10">
            <h1 className="text-[12vw] font-display font-bold uppercase tracking-tighter text-black leading-none">
              Cyber<span className="text-transparent stroke-black stroke-2">Shift</span>
            </h1>
            <p className="mt-4 text-sm font-body tracking-[0.5em] text-neon-green uppercase animate-pulse">
              Virtual Runway // Autumn 2026
            </p>
          </div>
        </section>

        {/* Section 2: Fabric Lab */}
        {/* BG Transparent to reveal Canvas behind it. */}
        <section id="fabric-lab" className="min-h-screen w-full bg-transparent text-black py-20 flex flex-col items-center justify-center relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-display font-bold uppercase">The Fabric Lab</h2>
            <p className="text-gray-500 font-mono mt-2 tracking-widest">Molecular Engineering</p>
          </div>

          {/* Viewports */}
          <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl px-4 justify-center items-center">
            <div className="relative group cursor-crosshair">
              <div ref={view1Ref} className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200 bg-transparent transition-transform group-hover:scale-110 duration-500" />
              <p className="text-center font-bold mt-6 uppercase text-sm tracking-widest text-gray-400 group-hover:text-black transition-colors">Sleeve</p>
            </div>
            <div className="relative group cursor-crosshair">
              <div ref={view2Ref} className="w-88 h-88 rounded-full overflow-hidden border-4 border-neon-green bg-transparent shadow-[0_0_30px_#39ff1440] transition-transform group-hover:scale-105 duration-500" />
              <p className="text-center font-bold mt-6 uppercase text-sm tracking-widest text-neon-green">Grain</p>
            </div>
            <div className="relative group cursor-crosshair">
              <div ref={view3Ref} className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-200 bg-transparent transition-transform group-hover:scale-110 duration-500" />
              <p className="text-center font-bold mt-6 uppercase text-sm tracking-widest text-gray-400 group-hover:text-black transition-colors">Fiber</p>
            </div>
          </div>
        </section>

        {/* Section 3: Lookbook (DOM) */}
        <div>
          <LookbookDOM />
        </div>

        {/* Footer */}
        <section className="h-[50vh] w-full bg-white flex flex-col items-center justify-center relative z-20 border-t border-gray-200">
          <div className="text-center">
            <h2 className="text-black text-6xl font-display uppercase italic">Pre-Order Now</h2>
            <button className="mt-8 px-12 py-4 border border-black text-black hover:bg-black hover:text-white transition-colors uppercase tracking-[0.2em] text-sm cursor-pointer font-bold">
              Enter The Grid
            </button>
          </div>
          <p className="absolute bottom-8 text-gray-400 text-xs uppercase tracking-widest">© 2026 Cybershift Inc.</p>
        </section>
      </div>
    </main>
  )
}
