"use client"

import { Button } from "@/components/ui/button"
import { Palette, ArrowLeft, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export default function SceneMakerPage2() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const isAnimatingRef = useRef(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastWheelTime = useRef(0)
  const wheelAccumulator = useRef(0)

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

    // Dimensions & offsets
    const H_EXP = 320,
      H_COL1 = 48,
      H_COL2 = 24
    const W_EXP = 1024,
      W_COL1 = 768,
      W_COL2 = 640

    // 🎯 Change this value to customize the gap between cards
    const GAP = 3 // Changed from 0 to 8px - adjust this value to your preference

    const Y_EXP = 0
    const Y_COL1_UP = -(H_EXP / 2 + GAP + H_COL1 / 2)
    const Y_COL2_UP = -(H_EXP / 2 + GAP + H_COL1 + GAP + H_COL2 / 2)
    const Y_COL1_DN = H_EXP / 2 + GAP + H_COL1 / 2
    const Y_COL2_DN = H_EXP / 2 + GAP + H_COL1 + GAP + H_COL2 / 2

    const animateCardsToPosition = (targetIndex: number, direction: 1 | -1 | null = null) => {
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
          ;[y, h, w, op, z] = [Y_EXP, H_EXP, W_EXP, 1, 30]
        } else if (relativePosition === cards.length - 1) {
          // First collapsed card above
          ;[y, h, w, op, z] = [Y_COL1_UP, H_COL1, W_COL1, 0.8, 20]
        } else if (relativePosition === cards.length - 2) {
          // Second collapsed card above
          ;[y, h, w, op, z] = [Y_COL2_UP, H_COL2, W_COL2, 0.6, 10]
        } else if (relativePosition === 1) {
          // Only one collapsed card below - same width as main card
          // Position card below so its bottom aligns with active card's bottom
          const activeCardBottom = Y_EXP + H_EXP / 2
          const cardBelowY = activeCardBottom + GAP + H_COL1 / 2 // Added GAP here too
          ;[y, h, w, op, z] = [cardBelowY, H_COL1, W_EXP, 0.8, 20]
        } else {
          // Hidden cards (including the second card below)
          y = direction === 1 ? Y_COL2_UP - 100 : direction === -1 ? Y_COL2_DN + 100 : 350
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
              duration: 0.5,
              ease: "power2.out",
            },
            0,
          )
        }
      })
    }

    // Initial setup
    animateCardsToPosition(currentIndex)

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Prevent new animations if one is already running
      if (isAnimatingRef.current) return

      const now = Date.now()
      const timeDelta = now - lastWheelTime.current

      // Reset accumulator if too much time has passed
      if (timeDelta > 150) {
        wheelAccumulator.current = 0
      }

      lastWheelTime.current = now
      wheelAccumulator.current += Math.abs(e.deltaY)

      // Only trigger animation when we've accumulated enough wheel delta
      if (wheelAccumulator.current > 50) {
        const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1
        const nextIdx = (currentIndex + direction + cards.length) % cards.length

        // Reset accumulator
        wheelAccumulator.current = 0

        // Animate to new position
        animateCardsToPosition(nextIdx, direction)
        setCurrentIndex(nextIdx)
      }
    }

    mainElement.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      mainElement.removeEventListener("wheel", handleWheel)
    }
  }, [currentIndex, cards.length])

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-white">Scene Maker</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center min-h-[calc(100vh-80px)] p-4 pt-16">
        {/* Card Stack */}
        <div className="relative w-full max-w-5xl h-[30rem] flex items-center justify-center">
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className={`absolute rounded-3xl shadow-2xl flex items-center justify-center ${card.gradient}`}
              style={{ left: "50%" }}
            >
              {/* <span className="text-white text-xl font-bold">{card.title}</span> */}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="w-full max-w-5xl flex justify-start mt-4">
          <div className="text-white font-medium">Jul 19 - 1349</div>
        </div>

        {/* New Project Button */}
        <div className="flex-1 flex items-end justify-center pb-8">
          <div className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 rounded-3xl shadow-2xl px-16 py-6 cursor-pointer">
            <div className="flex items-center justify-center gap-4 text-white font-medium text-lg">
              <Plus className="h-6 w-6 font-light" />
              <span>New project</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
