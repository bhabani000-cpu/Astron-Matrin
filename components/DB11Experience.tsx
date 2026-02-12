"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface DB11ExperienceProps {
  scrollYProgress: MotionValue<number>;
}

export default function DB11Experience({ scrollYProgress }: DB11ExperienceProps) {
  // --- PRECISION SCROLL MAPPING ---
  
  // HERO (0% - 15%) - Fades out quickly
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);

  // DB11 TITLE TRANSITION (Persistent)
  // Moves from center (0) to top (-42vh), scales down (1 -> 0.5), fades slightly (1 -> 0.4)
  const db11Y = useTransform(scrollYProgress, [0, 0.3], ["0%", "-40vh"]);
  const db11Scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);
  const db11Opacity = useTransform(scrollYProgress, [0, 0.1, 0.8, 1], [1, 0.4, 0.4, 0]); // Stronger visibility

  // DESIGN (30% - 60%) - Side View
  const designOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const designX = useTransform(scrollYProgress, [0.25, 0.65], [-50, 0]);

  // ENGINE (75% - 100%) - Rear/Engine View
  const engineOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const engineY = useTransform(scrollYProgress, [0.75, 1], [50, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full flex items-center justify-center">
      
      {/* ---------------- HERO SECTION ---------------- */}
      {/* 1. Subtitles & Description (Fade Out) */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="text-center flex flex-col items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none"
      >
        <div className="overflow-hidden mb-2 absolute -top-32">
            <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-aston-green tracking-[0.3em] font-orbitron text-sm md:text-base font-bold"
            >
              THE DEFINITIVE GT
            </motion.h2>
        </div>

        {/* Placeholder for layout spacing */}
        <div className="h-[10rem] md:h-[15rem]" />

        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 2.5, duration: 1, ease: "circOut" }}
            className="h-1 bg-gradient-to-r from-transparent via-aston-lime to-transparent my-6"
        />

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="text-xl md:text-2xl font-rajdhani text-gray-300 tracking-wide"
        >
          A NEW CHAPTER IN HISTORY
        </motion.p>
      </motion.div>

      {/* 2. DB11 Main Title (Moves to Top) */}
      <motion.div
        style={{ 
            y: db11Y, 
            scale: db11Scale,
            opacity: db11Opacity
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 whitespace-nowrap"
      >
         <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[10rem] font-bold font-orbitron text-white leading-[0.9] tracking-tighter"
        >
          DB11
        </motion.h1>
      </motion.div>


      {/* ---------------- DESIGN SECTION ---------------- */}
      <motion.div 
        style={{ opacity: designOpacity, x: designX }}
        className="absolute left-8 md:left-24 max-w-xl top-1/2 -translate-y-1/2"
      >
        <div className="pl-6 border-l-4 border-aston-lime">
          <h2 className="text-5xl md:text-7xl font-orbitron text-white mb-6 leading-none">
            AERODYNAMIC<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aston-lime to-white">SCULPTURE</span>
          </h2>
          <p className="text-xl md:text-2xl font-rajdhani text-gray-300 leading-relaxed font-light">
            The DB11 exploits the air flowing over and through its bodywork to generate stability without clutter.
          </p>
        </div>
      </motion.div>


      {/* ---------------- ENGINE SECTION ---------------- */}
      <motion.div 
        style={{ opacity: engineOpacity, y: engineY }}
        className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 text-right"
      >
        <div className="flex flex-col items-end">
            <h2 className="text-5xl md:text-7xl font-orbitron text-white mb-10 relative">
              V12 POWERTRAIN
              <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-aston-lime"></span>
            </h2>
            
            <div className="grid gap-6 font-rajdhani">
                <SpecItem label="Engine" value="5.2L TWIN-TURBO" />
                <SpecItem label="Power" value="630 HP" />
                <SpecItem label="Torque" value="700 NM" />
                <SpecItem label="0-100 KM/H" value="3.7 S" />
                <SpecItem label="Top Speed" value="334 KM/H" />
            </div>
        </div>
      </motion.div>

    </div>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-end items-center gap-8 group">
            <span className="text-gray-500 uppercase tracking-widest text-sm font-bold group-hover:text-aston-lime transition-colors duration-300">
                {label}
            </span>
            <span className="text-4xl md:text-6xl font-normal text-white group-hover:drop-shadow-[0_0_10px_rgba(0,168,107,0.4)] transition-all duration-300">
                {value}
            </span>
        </div>
    )
}
