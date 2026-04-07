import { ProductsService } from './products.service';
import { Product } from './product.interface';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string, subCategory?: string, sex?: string, ageGroup?: string, brandId?: string, minPrice?: string, maxPrice?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(product: Omit<Product, 'id'>): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product>;
    remove(id: string): Promise<boolean>;
}
