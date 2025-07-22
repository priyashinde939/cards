"use client"

import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import { ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function SceneMakerPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const isAnimatingRef = useRef(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastScrollTime = useRef(0)
  const [clipPosition, setClipPosition] = useState(90)

  // Card data for cycling
  const cards = [
    { id: 1, title: "Mountain Scene", gradient: "bg-gradient-to-br from-gray-600 to-gray-800" },
    { id: 2, title: "Ocean Waves", gradient: "bg-gradient-to-br from-gray-600 to-gray-800" },
    { id: 3, title: "Forest Path", gradient: "bg-gradient-to-br from-gray-600 to-gray-800" },
    { id: 4, title: "Desert Sunset", gradient: "bg-gradient-to-br from-gray-600 to-gray-800" },
    { id: 5, title: "City Lights", gradient: "bg-gradient-to-br from-gray-600 to-gray-800" },
    { id: 6, title: "Aurora Night", gradient: "bg-gradient-to-br from-gray-600 to-gray-800" },
  ]

  useEffect(() => {
    const mainElement = document.querySelector("main")
    if (!mainElement) return

    // Get container width for responsive sizing
    const containerWidth = Math.min(window.innerWidth * 0.9, 1200) // Max 1200px, 90% of viewport

    // Dimensions & offsets - responsive to container width
    const H_EXP = 450,
      H_COL1 = 52,
      H_COL2 = 26
    const W_EXP = containerWidth * 0.85, // 85% of container to prevent clipping
      W_COL1 = containerWidth * 0.65, // 65% of container
      W_COL2 = containerWidth * 0.55 // 55% of container

    // 🎯 Change this value to customize the gap between cards
    const GAP = 8 // Changed from 3 to 8px - adjust this value to your preference

    const Y_EXP = 0
    const Y_COL1_UP = -(H_EXP / 2 + GAP + H_COL1 / 2)
    const Y_COL2_UP = -(H_EXP / 2 + GAP + H_COL1 + GAP + H_COL2 / 2)
    const Y_COL1_DN = H_EXP / 2 + GAP + H_COL1 / 2
    const Y_COL2_DN = H_EXP / 2 + GAP + H_COL1 + GAP + H_COL2 / 2

    const animateCardsToPosition = (targetIndex: number, direction: 1 | -1 | null = null) => {
      // Recalculate dimensions for responsive sizing
      const currentContainerWidth = Math.min(window.innerWidth * 0.9, 1200)
      const currentW_EXP = currentContainerWidth * 0.85
      const currentW_COL1 = currentContainerWidth * 0.65
      const currentW_COL2 = currentContainerWidth * 0.55

      // Calculate clipping position: bottom of expanded card + gap
      const expandedCardBottom = Y_EXP + H_EXP / 2
      const clipLine = expandedCardBottom + GAP
      const containerHeight = 640 // 40rem = 640px
      const clipPositionPercent = ((containerHeight / 2 + clipLine) / containerHeight) * 100
      setClipPosition(clipPositionPercent)

      // Set animation state immediately
      if (direction !== null) {
        isAnimatingRef.current = true
      }

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })

      cardRefs.current.forEach((card, i) => {
        if (!card) return

        const relativePosition = (i - targetIndex + cards.length) % cards.length
        let y = 0,
          h = 0,
          w = 0,
          op = 0,
          z = 1

        if (relativePosition === 0) {
          // Expanded card (current)
          ;[y, h, w, op, z] = [Y_EXP, H_EXP, currentW_EXP, 1, 30]
        } else if (relativePosition === cards.length - 1) {
          // First collapsed card above
          ;[y, h, w, op, z] = [Y_COL1_UP, H_COL1, currentW_COL1, 0.8, 20]
        } else if (relativePosition === cards.length - 2) {
          // Second collapsed card above
          ;[y, h, w, op, z] = [Y_COL2_UP, H_COL2, currentW_COL2, 0.6, 10]
        } else if (relativePosition === 1) {
          // Bottom card - visible but positioned to collapse and get clipped
          const activeCardBottom = Y_EXP + H_EXP / 2
          const cardBelowY = activeCardBottom + GAP + H_COL1 / 2
          ;[y, h, w, op, z] = [cardBelowY, H_COL1, currentW_COL1, 0.8, 20]
        } else {
          // Hidden cards - always appear from top regardless of scroll direction
          y = Y_COL2_UP - 100
          h = 0
          w = 0
          op = 0
          z = 1
        }

        if (direction === null) {
          // Initial setup - ensure cards are properly centered
          gsap.set(card, {
            x: "-50%",
            y,
            height: `${h}px`,
            width: `${w}px`,
            opacity: op,
            zIndex: z,
          })
        } else {
          // Animation - maintain center position during animation
          tl.to(
            card,
            {
              x: "-50%",
              y,
              height: `${h}px`,
              width: `${w}px`,
              opacity: op,
              zIndex: z,
              duration: 0.6,
              ease: "power2.inOut",
            },
            0,
          )
        }
      })
    }

    // Initial setup using requestAnimationFrame to ensure DOM and GSAP are ready
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animateCardsToPosition(currentIndex)
      })
    })

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Prevent rapid scrolling: 500ms minimum between actions
      const now = Date.now()
      if (now - lastScrollTime.current < 500) return

      // Only react to significant scroll movements
      if (Math.abs(e.deltaY) < 20) return

      lastScrollTime.current = now
      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1
      const nextIdx = (currentIndex + direction + cards.length) % cards.length

      // Animate to new position
      animateCardsToPosition(nextIdx, direction)
      setCurrentIndex(nextIdx)
    }

    const handleResize = () => {
      // Force a complete recalculation with new dimensions
      animateCardsToPosition(currentIndex, null)
    }

    mainElement.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("resize", handleResize)

    return () => {
      mainElement.removeEventListener("wheel", handleWheel)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [currentIndex, cards.length])

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-white hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="relative flex flex-col items-center min-h-screen p-4 pt-16 overflow-hidden">
        {/* Card Stack */}
        <div
          className="relative w-full max-w-5xl h-[40rem] flex items-center justify-center overflow-hidden"
          style={{
            maskImage: `linear-gradient(to bottom, black 0%, black ${clipPosition}%, transparent ${clipPosition + 0.1}%), linear-gradient(to right, black 0%, black 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black ${clipPosition}%, transparent ${clipPosition + 0.1}%), linear-gradient(to right, black 0%, black 100%)`,
            maskComposite: "intersect",
            WebkitMaskComposite: "intersect",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className={`absolute shadow-2xl flex items-center justify-center overflow-hidden ${card.gradient}`}
              style={{ left: "50%", borderRadius: "64px", maxWidth: "calc(133.333cqh)" }}
            >
              <span className="text-white text-xl font-bold">{card.title}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="w-full max-w-5xl flex justify-start mt-4">
          <div className="text-white font-medium">Jul 19 - 1349</div>
        </div>

        {/* New Project Button - positioned with top edge slightly overlapping expanded card bottom */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 rounded-2xl shadow-2xl w-48 h-24 cursor-pointer">
            <div className="flex items-center justify-center h-full gap-4 text-white font-medium">
              <Plus className="h-6 w-6 font-light" />
              <span className="text-base">New project</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
