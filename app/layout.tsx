import NavbarHero from "@/components/Navbar";
import "./globals.css";
import HeroSlider from "@/components/HeroSilder";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavbarHero /> 
        <HeroSlider />
        {children}
      </body>
    </html>
  );
}
