"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1 }} // Slide in after intro
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-700 ${
        isScrolled ? "bg-black/50 backdrop-blur-md border-b border-white/5" : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Brand Logo - Minimal & Pure */}
      <div className="flex items-center gap-4 cursor-pointer group">
        <h1 className="text-xl md:text-2xl tracking-[0.2em] font-orbitron font-bold text-white group-hover:text-aston-lime transition-colors duration-500">
          ASTON MARTIN
        </h1>
      </div>

      {/* Center Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-12 font-rajdhani text-sm tracking-[0.2em] text-white/70">
         {["MODEL", "HISTORY", "INNOVATION"].map((item) => (
             <motion.div key={item} className="relative cursor-pointer group overflow-hidden">
                 <span className="group-hover:text-white transition-colors duration-300">{item}</span>
                 <span className="absolute bottom-0 left-0 w-full h-[1px] bg-aston-lime transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
             </motion.div>
         ))}
      </div>

      {/* CTA - Elegant Text Button */}
      <button className="group flex items-center gap-2 font-rajdhani text-sm tracking-[0.2em] text-white uppercase overflow-hidden">
        <span className="relative z-10 group-hover:text-aston-lime transition-colors duration-300">
            ENQUIRE
        </span>
        <motion.span 
            className="block h-[1px] w-8 bg-white group-hover:bg-aston-lime group-hover:w-12 transition-all duration-300" 
        />
      </button>
    </motion.nav>
  );
}
