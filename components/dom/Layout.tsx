'use client'

import { ReactLenis } from 'lenis/react'
import { useRef } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef(null)

    return (
        <ReactLenis root ref={lenisRef} autoRaf={true}>
            {children}
        </ReactLenis>
    )
}
