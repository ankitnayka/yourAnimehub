    // components/SaleBanner.tsx
import React from "react";
import { SaleBannerData } from "../types/sale";

interface SaleBannerProps {
  data: SaleBannerData;
  onCtaClick?: () => void;
}

export const saleData: SaleBannerData = {
  badge: "BUY 1 AND GET 1 FREE",
  title: "SALE",
  offerTitle: "BUY 1 GET 1 FREE",
  description:
    "Get the Pair of 2 T-shirts or 2 Items. Get this Amazing Offer. Don’t Miss This.",
  note: "Limited Time Offer",
  buttonText: "Get Offer Now",
};

const SaleBanner: React.FC<SaleBannerProps> = ({
  data,
  onCtaClick,
}) => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-0 md:grid-cols-2 items-center gap-10">

        {/* LEFT SECTION */}
        <div className="text-center md:text-left">
          <p className="text-sm tracking-widest text-gray-600 mb-4">
            {data.badge}
          </p>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-light tracking-widest">
            {data.title}
          </h1>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative md:pl-12 md:border-l border-gray-300">
          <h2 className="text-2xl font-semibold mb-4">
            {data.offerTitle}
          </h2>

          <p className="text-gray-600 mb-2">
            {data.description}
          </p>

          <p className="text-sm text-gray-500 mb-6">
            {data.note}
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="bg-black text-white px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            {data.buttonText}
          </button>
        </div>

      </div>
    </section>
  );
};

export default SaleBanner;
