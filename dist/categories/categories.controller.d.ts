import { CategoriesService } from './categories.service';
import { Category } from './category.interface';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
    create(category: Omit<Category, 'id'>): Promise<Category>;
    update(id: string, category: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<boolean>;
}
