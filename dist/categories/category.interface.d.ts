export interface SubCategory {
    id: number;
    name: string;
    image?: string;
}
export interface Category {
    id: number;
    name: string;
    image?: string;
    subCategories: SubCategory[];
    displayType?: 'default' | 'highlight' | 'sale' | 'flag';
    color?: string;
}
