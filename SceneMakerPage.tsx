
"use client";

import { Button } from "@/components/ui/button";
import { Palette, ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function SceneMakerPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Card data for cycling
  const cards = [
    { id: 1, title: "Mountain Scene", gradient: "from-blue-500 to-purple-600" },
    { id: 2, title: "Ocean Waves", gradient: "from-cyan-400 to-blue-500" },
    { id: 3, title: "Forest Path", gradient: "from-green-400 to-emerald-500" },
    { id: 4, title: "Desert Sunset", gradient: "from-orange-400 to-red-500" },
    { id: 5, title: "City Lights", gradient: "from-purple-400 to-pink-500" },
    { id: 6, title: "Aurora Night", gradient: "from-indigo-400 to-cyan-400" },
  ];

  const animateCardTransition = (direction: 'up' | 'down') => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        // Update the current index after animation
        if (direction === 'down') {
          setCurrentIndex((prev) => (prev + 1) % cards.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }
      }
    });

    const [topCard, middleCard, expandedCard] = cardRefs.current;

    if (direction === 'down') {
      // Middle card expands to expanded position
      tl.to(middleCard, {
        height: "20rem", // h-80
        width: "100%", // max-w-5xl
        y: 104, // Move to expanded position
        scale: 1.2,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)
      // Current expanded card collapses and moves down (disappears)
      .to(expandedCard, {
        height: "3rem", // h-12
        width: "75%", // max-w-3xl
        y: 200, // Move down and out
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)
      // Top card moves to middle position
      .to(topCard, {
        height: "3rem", // h-12
        width: "75%", // max-w-3xl
        y: 40, // Move to middle position
        scale: 1.1,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0);
    } else {
      // Reverse animation for scroll up
      // Similar but opposite direction
      tl.to(expandedCard, {
        height: "3rem",
        width: "75%",
        y: -40,
        scale: 0.9,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)
      .to(middleCard, {
        height: "1.5rem", // h-6
        width: "66.67%", // max-w-2xl
        y: -80,
        scale: 0.8,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0)
      .to(topCard, {
        height: "20rem",
        width: "100%",
        y: 60,
        scale: 1.2,
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut"
      }, 0);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (e.deltaY > 0) {
        animateCardTransition('down');
      } else {
        animateCardTransition('up');
      }
    };

    const main = document.querySelector('main');
    main?.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      main?.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
      <main className="flex flex-col items-center min-h-[calc(100vh-80px)] p-4 gap-3 justify-start pt-8">
        {/* First Collapsed Card - Much Thinner */}
        <div className="w-full max-w-2xl h-6 bg-gray-700 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800">
            {/* First collapsed project card - very thin */}
          </div>
        </div>

        {/* Second Collapsed Card - Medium Width & Clean */}
        <div className="w-full max-w-3xl h-12 bg-gray-700 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800">
            {/* Second collapsed project card */}
          </div>
        </div>

        {/* Main Expanded Canvas Area - Much Bigger */}
        <div className="w-full max-w-5xl h-80 bg-gray-700 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            {/* Main expanded canvas - primary workspace */}
          </div>
        </div>

        {/* Timeline - Bottom Left */}
        <div className="w-full max-w-5xl flex justify-start mt-4">
          <div className="text-white font-medium">
            Jul 19 - 1349
          </div>
        </div>

        {/* New Project Button - Center Bottom - Bigger and Cleaner */}
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
  );
}