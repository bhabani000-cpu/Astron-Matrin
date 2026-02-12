"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import Navbar from "@/components/Navbar";
import DB11ScrollCanvas from "@/components/DB11ScrollCanvas";
import DB11Experience from "@/components/DB11Experience";
import { totalFrames, imageFolderPath } from "@/data/carData";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="bg-aston-black min-h-screen">
      <Navbar />
      
      {/* 
        Scroll Container: 500vh to ensure enough scrollable distance 
        to play through the frames smoothly.
      */}
      <section ref={containerRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <DB11ScrollCanvas 
            scrollYProgress={scrollYProgress} 
            totalFrames={totalFrames}
            imageFolderPath={imageFolderPath}
          />
          <DB11Experience scrollYProgress={scrollYProgress} />
        </div>
      </section>

      <footer className="relative z-20 bg-aston-black py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-rajdhani text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ASTON MARTIN LAGONDA. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
