import type { Metadata, ResolvingMetadata } from 'next';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import ProductDetailClient from '@/components/product/ProductDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();

    // Fetch data
    const product = await Product.findOne({ slug }).select('name description image images price').lean() as any;

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    // Optionally access parent metadata if needed (e.g., base title)
    // const previousImages = (await parent).openGraph?.images || []

    const mainImage = product.image || (product.images && product.images[0]) || '';

    return {
        title: `${product.name} | YourAnimeHub`,
        description: product.description?.substring(0, 160) || `Buy ${product.name} - Premium Anime Streetwear at YourAnimeHub.`,
        openGraph: {
            title: product.name,
            description: product.description?.substring(0, 160) || `Buy ${product.name} - Premium Anime Streetwear at YourAnimeHub.`,
            url: `/product/${slug}`, // Relative URL, Next.js handles base if metadataBase is set in layout
            siteName: 'YourAnimeHub',
            images: [
                {
                    url: mainImage,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description?.substring(0, 160) || `Buy ${product.name} - Premium Anime Streetwear at YourAnimeHub.`,
            images: [mainImage],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    return <ProductDetailClient slug={slug} />;
}
