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

      const cardGap = 2

      cardsRef.current.forEach((card, index) => {
        const relativePosition = (index - nextIndex + cards.length) % cards.length

        if (relativePosition === 0) {
          tl.fromTo(
            card,
            {
              y: 200,
              height: "0rem",
              // width: "60rem",
              width: "50rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0.7,
              zIndex: 5,
            },
            {
              y: 0,
              height: "16rem",
              width: "60rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 1,
              zIndex: 10,
              duration: 0.9,
              ease: "linear",
            },
            0,
          )
        } else if (relativePosition === cards.length - 1) {
          tl.fromTo(
            card,
            {
              y: 0,
              height: "16rem",
              width: "60rem",
              opacity: 1,
              zIndex: 10,
            },
            {
              y: -(56 / 2 + cardGap + 40 / 2),
              height: "2.5rem",
              width: "50rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0.8,
              zIndex: 20,
              duration: 0.9,
              ease: "linear",
            },
            0,
          )
        } else if (relativePosition === cards.length - 2) {
          tl.fromTo(
            card,
            {
              y: -(56 / 2 + cardGap + 40 / 2),
              height: "2.5rem",
              width: "50rem",
              opacity: 0.8,
              zIndex: 20,
            },
            {
              y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 / 2),
              height: "1.2rem",
              width: "45rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0.6,
              zIndex: 30,
              duration: 0.9,
              ease: "linear",
            },
            0,
          )
        } else if (relativePosition === cards.length - 3) {
          tl.fromTo(
            card,
            {
              y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 / 2),
              height: "1.2rem",
              width: "45rem",
              opacity: 0.6,
              zIndex: 30,
            },
            {
              y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 + cardGap + 8 / 2),
              height: "0.5rem",
              width: "40rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0,
              zIndex: 40,
              duration: 0.9,
              ease: "linear",
            },
            0,
          )
        } else if (relativePosition === 1) {
          tl.set(
            card,
            {
              y: 250,
              height: "0rem",
              width: "60rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0.5,
              zIndex: 3,
            },
            0,
          )
        } else {
          tl.set(
            card,
            {
              y: 300,
              height: "10rem",
              width: "45rem",
              scaleY: 1,
              scaleX: 1,
              opacity: 0,
              zIndex: 1,
            },
            0,
          )
        }
      })
    }

    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = (e: WheelEvent) => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => handleScroll(e), 30)
    }

    container.addEventListener("wheel", throttledScroll, { passive: false })

    cardsRef.current.forEach((card, index) => {
      const relativePosition = (index - currentIndex + cards.length) % cards.length
      const cardGap = 8

      if (relativePosition === 0) {
        gsap.set(card, {
          y: 0,
          height: "16rem",
          width: "60rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 1,
          zIndex: 10,
        })
      } else if (relativePosition === cards.length - 1) {
        gsap.set(card, {
          y: -(56 / 2 + cardGap + 40 / 2),
          height: "2.5rem",
          width: "50rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 0.8,
          zIndex: 20,
        })
      } else if (relativePosition === cards.length - 2) {
        gsap.set(card, {
          y: -(56 / 2 + cardGap + 40 + cardGap + 19.2 / 2),
          height: "1.2rem",
          width: "45rem",
          scaleY: 1,
          scaleX: 1,
          opacity: 0.6,
          zIndex: 30,
        })
      } else {
        gsap.set(card, {
          y: 200,
          height: "16rem",
          width: "45rem",
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
      <div className="relative w-[62rem] h-64">
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
