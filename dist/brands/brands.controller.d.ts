import { Brand } from './brand.interface';
import { BrandsService } from './brands.service';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    findAll(): Promise<Brand[]>;
    create(brand: Omit<Brand, 'id'>): Promise<Brand>;
    update(id: string, brand: Partial<Brand>): Promise<Brand>;
    remove(id: string): Promise<boolean>;
}
