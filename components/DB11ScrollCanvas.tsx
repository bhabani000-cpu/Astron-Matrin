"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent, AnimatePresence, motion } from "framer-motion";

interface DB11ScrollCanvasProps {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath: string;
}

export default function DB11ScrollCanvas({
  scrollYProgress,
  totalFrames,
  imageFolderPath,
}: DB11ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // State for loading coordination
  const [imagesReady, setImagesReady] = useState(false);
  const [minTimeReady, setMinTimeReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Controls visibility of content vs loader
  
  // Minimum 3-second loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Sync isLoaded state
  useEffect(() => {
    if (imagesReady && minTimeReady) {
      setIsLoaded(true);
    }
  }, [imagesReady, minTimeReady]);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const total = totalFrames;
    
    // Sort just in case async loading mixes order
    const orderedImages: HTMLImageElement[] = new Array(total);
    let loaded = 0;
    
    for (let i = 0; i < total; i++) {
        const img = new Image();
        const frameNum = i + 1;
        // filename: frame-001.jpg
        const filename = `frame-${frameNum.toString().padStart(3, "0")}.jpg`;
        img.src = `${imageFolderPath}/${filename}`;
        img.onload = () => {
             loaded++;
             if (loaded === total) setImagesReady(true);
        }
        orderedImages[i] = img;
    }
    
    imagesRef.current = orderedImages;
  }, [totalFrames, imageFolderPath]);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    
    // Ensure canvas, context, and image exist
    if (!canvas || !images[index]) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    
    // Set canvas dimensions to window size allowing for high DPI
    const dpr = window.devicePixelRatio || 1;
    // We only want to set canvas width/height if it changed to avoid flickering
    if (canvas.width !== window.innerWidth * dpr || canvas.height !== window.innerHeight * dpr) {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    }
    
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (canvasRatio > imgRatio) {
       drawHeight = canvasHeight;
       drawWidth = drawHeight * imgRatio;
       offsetX = (canvasWidth - drawWidth) / 2;
       offsetY = 0;
    } else {
       drawWidth = canvasWidth;
       drawHeight = drawWidth / imgRatio;
       offsetX = 0;
       offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Initial render when ready
  useEffect(() => {
    if (isLoaded) {
        requestAnimationFrame(() => renderFrame(0));
    }
  }, [isLoaded]);

  // Update on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded) return;
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.floor(latest * (totalFrames - 1))
    );
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
       if (!isLoaded) return;
       const currentProgress = scrollYProgress.get();
       const frameIndex = Math.min(
         totalFrames - 1,
         Math.floor(currentProgress * (totalFrames - 1))
       );
       renderFrame(frameIndex);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, scrollYProgress, totalFrames]);

  // Prevent hydration errors (browser extension interference)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-aston-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Background Logo (Watermark) */}
            <motion.div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            >
                {/* Aston Martin Wings SVG */}
                <svg width="1200" height="600" viewBox="0 0 1000 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M500 70 L950 70 C950 70 850 150 700 150 C600 150 550 120 500 120 C450 120 400 150 300 150 C150 150 50 70 50 70 L500 70Z" fill="white" />
                    <path d="M500 70 L950 70 L950 75 L500 75 Z" fill="white" />
                    {/* Abstract Wings for Watermark Feel */}
                    <path d="M100 70 Q 300 150 500 150 Q 700 150 900 70" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M150 70 Q 320 130 500 130 Q 680 130 850 70" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M200 70 Q 340 110 500 110 Q 660 110 800 70" stroke="white" strokeWidth="2" fill="none" />
                </svg>
            </motion.div>

            {/* Elegant Split Line Reveal */}
            <div className="relative flex flex-col items-center z-10">
                <div className="overflow-hidden mb-6">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    >
                        <motion.h1 
                            className="text-7xl md:text-9xl font-cinzel font-bold text-transparent bg-clip-text tracking-[0.1em]"
                            style={{ 
                                backgroundImage: "linear-gradient(135deg, #0B2F2A 0%, #145A4F 25%, #ffffff 50%, #145A4F 75%, #0B2F2A 100%)",
                                backgroundSize: "200% auto",
                                WebkitTextStroke: "1px rgba(255,255,255,0.1)",
                                filter: "drop-shadow(0 0 10px rgba(20, 90, 79, 0.5))"
                            }}
                            animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            ASTON MARTIN
                        </motion.h1>
                    </motion.div>
                </div>

                <div className="overflow-hidden mt-2">
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                        className="flex items-center gap-4"
                    >
                         <h2 className="text-6xl md:text-8xl font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 font-bold">
                            V12
                         </h2>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, ease: "circOut", delay: 1 }}
                    className="h-[1px] w-full max-w-xs bg-gradient-to-r from-transparent via-aston-lime to-transparent my-6"
                />

                <div className="overflow-hidden">
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1.4 }}
                        className="font-rajdhani text-gray-400 text-sm tracking-[0.5em] uppercase"
                    >
                        P U R E &nbsp; P E R F O R M A N C E
                    </motion.p>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
