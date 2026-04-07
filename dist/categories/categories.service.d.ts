import { Category } from './category.interface';
export declare class CategoriesService {
    private store;
    findAll(): Promise<Category[]>;
    create(category: Omit<Category, 'id'>): Promise<Category>;
    update(id: number, category: Partial<Category>): Promise<Category>;
    remove(id: number): Promise<boolean>;
}
