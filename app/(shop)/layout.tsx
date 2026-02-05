import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/ui/FloatingActions";
import dbConnect from "@/lib/dbConnect";
import Settings from "@/models/Settings";

async function getContactPhone() {
    try {
        await dbConnect();
        const settings = await Settings.findOne().select('contactInfo.phone').lean();
        return settings?.contactInfo?.phone;
    } catch (e) {
        console.error("Failed to fetch contact phone", e);
        return null;
    }
}

export default async function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const phone = await getContactPhone();

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-[88px]">
                {children}
            </main>
            <FloatingActions whatsappNumber={phone} />
            <Footer />
        </>
    );
}
