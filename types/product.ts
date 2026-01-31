export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discountPercentage?: number;
    image: string;
    hoverImage?: string;
    badges?: string[];
    slug: string;
    category: string;
    stock?: number;
    status?: string;
    isFeatured?: boolean;
    isNewArrival?: boolean;
}

