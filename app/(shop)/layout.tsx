import Navbar from "@/components/Navbar";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-[88px]">
                {children}
            </main>
            {/* Footer will go here */}
        </>
    );
}
