"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function AstonCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Smooth spring physics for trail effect
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative flex items-center justify-center"
      >
        {/* Aston Martin Wing Inspired Shape */}
        <svg
          width="60"
          height="24"
          viewBox="0 0 60 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(0,168,107,0.6)]"
        >
          {/* Main Wing Body */}
          <path
            d="M30 14L58 10C59 10 60 9 56 6C52 3 45 6 36 8L30 8L24 8C15 6 8 3 4 6C0 9 1 10 2 10L30 14Z"
            fill="#E0E0E0" // Metallic Silver
            stroke="#00A86B" // Aston Green
            strokeWidth="0.5"
          />
          {/* Center details */}
          <path d="M28 8L30 2L32 8" stroke="#00A86B" strokeWidth="1" />
        </svg>
        
        {/* Glow effect center */}
        <div className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
      </motion.div>
    </motion.div>
  );
}
