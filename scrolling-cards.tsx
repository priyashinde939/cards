"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export default function ScrollingCards2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isAnimatingRef = useRef(false)

  const cards = [
    { id: 1, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: 2, color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { id: 3, color: "bg-gradient-to-br from-green-500 to-emerald-500" },
    { id: 4, color: "bg-gradient-to-br from-orange-500 to-red-500" },
    { id: 5, color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
    { id: 6, color: "bg-gradient-to-br from-pink-500 to-rose-500" },
    { id: 7, color: "bg-gradient-to-br from-teal-500 to-green-500" },
    { id: 8, color: "bg-gradient-to-br from-yellow-500 to-orange-500" },
  ]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      if (isAnimatingRef.current) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = (currentIndex + direction + cards.length) % cards.length

      if (nextIndex === currentIndex) return

      isAnimatingRef.current = true
      animateCards(nextIndex)
      setCurrentIndex(nextIndex)
    }

    const animateCards = (nextIndex: number) => {
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })

      // Consistent small gap between cards
      const cardGap = 2

      cardsRef.current.forEach((card, index) => {
        const relativePosition = (index - nextIndex + cards.length) % cards.length

        if (relativePosition === 0) {
          // New active card (expanding from 0% height) - perfectly synced
          tl.fromTo(
            card,
            {
              y: 200,
              height: "0rem", // Start with 0% height
              width: "24rem", // Keep width constant at 100%
              scaleY: 1,
              scaleX: 1,
              opacity: 0.7,
              zIndex: 5,
            },
            {
              y: 0, // Active card at center
              height: "16rem", // 256px - Expand to 100% height
              width: "24rem", // Width remains constant
              scaleY: 1,
              scaleX: 1,
              opacity: 1,
              zIndex: 10,
              duration: 0.9, // Synchronized duration
              ease: "linear", // Synchronized easing
            },
            0, // All start at same time
          )
        } else if (relativePosition === cards.length - 1) {
          // Current active card becoming first stacked card - perfectly synced
          tl.fromTo(
            card,
            {
              y: 0,
              height: "16rem", // 256px - Start at full size
              width: "24rem", // Start at full width
              opacity: 1,
              zIndex: 10,
            },
            {
              y: -(56 / 2 + cardGap + 40 / 2), // -(128 + 8 + 20) = -156px
              height: "2.5rem", // 40px - Shrink to stacked size
              width: "20rem", // Shrink to stacked width
              scaleY: 1,
              scaleX: 1,
              opacity: 0.8,
              zIndex: 20,
              duration: 0.9, // Synchronized duration
              ease: "linear", // Synchronized easing
            },
            0, // All start at same time
          )
        } else if (relativePosition === cards.length - 2) {
          // First stacked becoming second stacked - perfectly synced with active card
          tl.fromTo(
            card,
            {
              y: -(56 / 2 + cardGap + 40 / 2), // -156px - Start at first stacked position
              height: "2.5rem", // 40px - Start at first stacked size
              width: "20rem", // Start at first stacked width
              opacity: 0.8,
              zIndex: 20,
            },
            {
              y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 / 2), // -(128 + 8 + 40 + 8 + 9.6) = -193.6px
              height: "1.2rem", // 19.2px - Shrink to second stacked size
              width: "18rem", // Shrink to second stacked width
              scaleY: 1,
              scaleX: 1,
              opacity: 0.6,
              zIndex: 30,
              duration: 0.9, // Synchronized duration - same as active card
              ease: "linear", // Synchronized easing - same as active card
            },
            0, // Start at exactly same time as active card
          )
        } else if (relativePosition === cards.length - 3) {
          // Second stacked fading out - perfectly synced with active card
          tl.fromTo(
            card,
            {
              y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 / 2), // -193.6px - Start at second stacked position
              height: "1.2rem", // 19.2px - Start at second stacked size
              width: "18rem", // Start at second stacked width
              opacity: 0.6,
              zIndex: 30,
            },
            {
              y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 + cardGap + 8 / 2), // -(128 + 8 + 40 + 8 + 19.2 + 8 + 4) = -215.2px
              height: "0.5rem", // 8px - Shrink to fade size
              width: "16rem", // Shrink to fade width
              scaleY: 1,
              scaleX: 1,
              opacity: 0,
              zIndex: 40,
              duration: 0.9, // Synchronized duration - same as active card
              ease: "linear", // Synchronized easing - same as active card
            },
            0, // Start at exactly same time as active card
          )
        } else if (relativePosition === 1) {
          // Card preparing to come into view - perfectly synced
          tl.set(
            card,
            {
              y: 250,
              height: "0rem", // Start with 0 height
              width: "24rem", // Full width ready
              scaleY: 1,
              scaleX: 1,
              opacity: 0.5,
              zIndex: 3,
            },
            0, // All start at same time
          )
        } else {
          // Hidden cards - perfectly synced
          tl.set(
            card,
            {
              y: 300,
              height: "10rem",
              width: "18rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0,
              zIndex: 1,
            },
            0, // All start at same time
          )
        }
      })
    }

    // Throttled scroll handler
    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = (e: WheelEvent) => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => handleScroll(e), 30)
    }

    container.addEventListener("wheel", throttledScroll, { passive: false })

    // Initial setup with consistent gaps
    cardsRef.current.forEach((card, index) => {
      const relativePosition = (index - currentIndex + cards.length) % cards.length
      const cardGap = 8

      if (relativePosition === 0) {
        // Active card
        gsap.set(card, {
          y: 0,
          height: "16rem", // 256px
          width: "24rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 1,
          zIndex: 10,
        })
      } else if (relativePosition === cards.length - 1) {
        // First stacked card - positioned with exact gap
        gsap.set(card, {
          y: -(56 / 2 + cardGap + 40 / 2), // -156px
          height: "2.5rem", // 40px
          width: "20rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 0.8,
          zIndex: 20,
        })
      } else if (relativePosition === cards.length - 2) {
        // Second stacked card - positioned with exact gap
        gsap.set(card, {
          y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 / 2), // -193.6px
          height: "1.2rem", // 19.2px
          width: "18rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 0.6,
          zIndex: 30,
        })
      } else {
        // Hidden cards
        gsap.set(card, {
          y: 200,
          height: "16rem",
          width: "24rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 0,
          zIndex: 1,
        })
      }
    })

    return () => {
      container.removeEventListener("wheel", throttledScroll)
      clearTimeout(scrollTimeout)
    }
  }, [currentIndex, cards.length])

  return (
    <div
      ref={containerRef}
      className="h-screen w-full bg-black flex items-center justify-center overflow-hidden relative"
    >
      <div className="relative w-96 h-64">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => {
              if (el) cardsRef.current[index] = el
            }}
            className={`absolute rounded-2xl ${card.color} shadow-2xl flex items-center justify-center transition-all`}
            style={{
              transformOrigin: "center center",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-white text-2xl font-bold">{card.id}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
