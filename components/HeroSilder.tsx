"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "DARKER THE DRIP",
    subtitle: "LOUDER THE VIBE",
    description: "Experience the chaos of premium streetwear designed for the bold.",
    image: "https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg",
    cta: "Shop The Collection",
    link: "/products"
  },
  {
    id: 2,
    title: "UNLEASH YOUR",
    subtitle: "URBAN LEGEND",
    description: "Dominate the streets with our exclusive anime-inspired drops.",
    image: "https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg",
    cta: "View Catalog",
    link: "/catalog"
  },
  {
    id: 3,
    title: "ELEVATE YOUR",
    subtitle: "AESTHETIC",
    description: "Where anime meets high fashion. Don't just watch it, wear it.",
    image: "https://p325k7wa.twic.pics/high/my-hero-academia/my-hero-ultra-rumble/00-page-setup/MHUR-new-header-mobile.jpg?twic=v1/resize=760/step=10/quality=80",
    cta: "Explore Now",
    link: "/products"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[90vh] overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto z-10">
        <AnimatePresence mode="wait">
          <div key={current} className="overflow-hidden">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-outline-white mb-2"
            >
              {slides[current].title}
            </motion.h2>

            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-primary mb-6"
            >
              {slides[current].subtitle}
            </motion.h2>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-200 max-w-lg mb-10 font-medium"
            >
              {slides[current].description}
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link
                href={slides[current].link}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all duration-300"
              >
                {slides[current].cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-6 md:left-20 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1 transition-all duration-500 ${index === current ? "w-12 bg-primary" : "w-6 bg-white/50"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

