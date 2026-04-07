import { Slide } from './slide.interface';
export declare class SlidersService {
    private store;
    findAll(category?: string): Promise<Slide[]>;
    create(slide: Omit<Slide, 'id'>): Promise<Slide>;
    update(id: number, slide: Partial<Slide>): Promise<Slide>;
    remove(id: number): Promise<boolean>;
}
