"use client";

import { title } from "process";
import { useEffect, useState } from "react";
import SaleBanner from "./SaleBanner";
import { SaleBannerData } from "@/types/sale";

const slides = [
  {
    title: "DARKER THE DRIP, LOUDER THE VIBE.",
    image:
      "https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg",
  },
  {
    title: "UNLEASH YOUR URBAN STYLE.",
    image:
      "https://images.pexels.com/photos/845434/pexels-photo-845434.jpeg",
  },
  {
    title: "ELEVATE YOUR STREETWEAR GAME.",
    image:
      "https://p325k7wa.twic.pics/high/my-hero-academia/my-hero-ultra-rumble/00-page-setup/MHUR-new-header-mobile.jpg?twic=v1/resize=760/step=10/quality=80",
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);






  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    // <section className="relative w-full sm:h-screen   overflow-hidden">
    <section className="relative w-full h-[75vh] sm:h-screen overflow-hidden">


      {/* Background Image */}
      <img
        src={slides[current].image}
        alt="hero"
        className="
    absolute inset-0 w-full h-full
    object-cover object-center
    sm:object-center
    transition-all duration-1000
  "
      />


      {/* <img
        src={slides[current].image}
        alt="hero"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
      /> */}
      {/* <img
  src={slides[current].image}
  alt="hero"
  className="
    absolute inset-0 w-full h-full
    object-contain bg-black
    sm:object-cover sm:bg-transparent
    transition-all duration-1000
  "
/> */}


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Text */}
      <div className="relative z-10 flex justify-center items-center h-full text-center px-6">
        <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase">
          {slides[current].title}
        </h1>
      </div>
     
    </section>
  );
}

