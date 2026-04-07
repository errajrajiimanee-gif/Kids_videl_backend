import { Brand } from './brand.interface';
export declare class BrandsService {
    private store;
    findAll(): Promise<Brand[]>;
    create(brand: Omit<Brand, 'id'>): Promise<Brand>;
    update(id: number, brand: Partial<Brand>): Promise<Brand>;
    remove(id: number): Promise<boolean>;
}
