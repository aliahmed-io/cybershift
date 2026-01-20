'use client'

import { useRef, useEffect } from 'react'
import Tilt from 'react-parallax-tilt'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const outfits = [
    {
        id: 1,
        name: "Urban Armor",
        price: "TYPE-01",
        color: "#f0f0f0", // Light Grey
        img: "/textures/lookbook/urban_armor.png",
        desc: "Ballistic nylon blend with adaptive thermal regulation."
    },
    {
        id: 2,
        name: "Neon Nomad",
        price: "TYPE-02",
        color: "#ffffff", // Pure White
        img: "/textures/lookbook/neon_nomad.png",
        desc: "High-visibility reflective shell for night operations."
    },
    {
        id: 3,
        name: "Cyber Shift",
        price: "TYPE-03",
        color: "#f5f5f5", // Off White
        img: "/textures/lookbook/cyber_shift.png",
        desc: "Liquid metal reactive fabric. Our signature piece."
    }
]

export default function LookbookDOM() {
    const containerRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const section = sectionRef.current
        if (!container || !section) return

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const color = entry.target.getAttribute('data-color')
                    if (color) {
                        gsap.to(section, {
                            backgroundColor: color,
                            duration: 0.8,
                            ease: "power2.out"
                        })
                    }
                }
            })
        }, {
            root: container,
            threshold: 0.5
        })

        const slides = container.querySelectorAll('.lookbook-slide')
        slides.forEach(slide => observer.observe(slide))

        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            className="h-screen w-full relative transition-colors duration-700 overflow-hidden"
            style={{ backgroundColor: '#fff' }}
        >
            <div
                ref={containerRef}
                className="w-full h-full flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide items-center"
            >
                {/* Intro Slide */}
                <div className="min-w-full h-full snap-center flex items-center justify-center bg-transparent" data-color="#ffffff">
                    <div className="text-center">
                        <h2 className="text-[12vw] font-display font-bold uppercase text-transparent stroke-black stroke-1 opacity-20">Lookbook</h2>
                        <p className="text-black mt-4 animate-pulse">Swipe to Explore &rarr;</p>
                    </div>
                </div>

                {outfits.map((item) => (
                    <div
                        key={item.id}
                        className="lookbook-slide min-w-full h-full snap-center flex items-center justify-center p-8 relative"
                        data-color={item.color}
                    >
                        <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
                            {/* Text Info */}
                            <div className="order-2 md:order-1 text-black">
                                <h4 className="text-red-500 font-mono mb-2">{item.price}</h4>
                                <h2 className="text-6xl font-display font-bold uppercase mb-6 leading-none">{item.name}</h2>
                                <p className="text-lg opacity-80 max-w-sm text-gray-700">{item.desc}</p>
                                <button className="mt-8 px-6 py-2 border border-black hover:bg-black hover:text-white transition-all uppercase text-sm tracking-wider cursor-pointer">
                                    Configurate
                                </button>
                            </div>

                            {/* Tilt Image */}
                            <div className="order-1 md:order-2">
                                <Tilt
                                    tiltMaxAngleX={5}
                                    tiltMaxAngleY={5}
                                    glareEnable={true}
                                    glareMaxOpacity={0.2}
                                    glareColor="#ffffff"
                                    glarePosition="all"
                                    scale={1.02}
                                    className="relative"
                                >
                                    <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-lg overflow-hidden shadow-2xl">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="object-cover w-full h-full block"
                                        />
                                    </div>
                                </Tilt>
                            </div>
                        </div>

                        {/* Large Background Number */}
                        <h3 className="absolute bottom-0 right-0 text-[30vw] font-display font-bold leading-none opacity-5 select-none pointer-events-none text-black truncate translate-y-1/4">
                            0{item.id}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    )
}
