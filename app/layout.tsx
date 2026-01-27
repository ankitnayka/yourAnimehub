'use client';

import NavbarHero from "@/components/Navbar";
import "./globals.css";
import HeroSlider from "@/components/HeroSilder";
import SaleBanner from "@/components/SaleBanner";
import { SaleBannerData } from "@/types/sale";




const saleData: SaleBannerData = {
  badge: "BUY 1 AND GET 1 FREE",
  title: "SALE",
  offerTitle: "BUY 1 GET 1 FREE",
  description:
    "Get the Pair of 2 T-shirts or 2 Items. Get this Amazing Offer. Don’t Miss This.",
  note: "Limited Time Offer",
  buttonText: "Get Offer Now",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleOfferClick = (): void => {
    console.log("Offer clicked");
  };
  return (
    <html lang="en">
      <body>
        <NavbarHero />
        <HeroSlider />
        <SaleBanner
          data={saleData}
          onCtaClick={handleOfferClick}
        />
        {children}
      </body>
    </html>
  );
}



