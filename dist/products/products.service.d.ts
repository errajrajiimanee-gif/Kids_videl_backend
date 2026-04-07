import { Product } from './product.interface';
export declare class ProductsService {
    private store;
    findAll(filters?: {
        category?: string;
        subCategory?: string;
        sex?: string;
        ageGroup?: string;
        brandId?: string;
        minPrice?: string;
        maxPrice?: string;
    }): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(product: Omit<Product, 'id'>): Promise<Product>;
    update(id: number, product: Partial<Product>): Promise<Product>;
    remove(id: number): Promise<boolean>;
}
