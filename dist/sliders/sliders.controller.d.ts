import { SlidersService } from './sliders.service';
import { Slide } from './slide.interface';
export declare class SlidersController {
    private readonly slidersService;
    constructor(slidersService: SlidersService);
    findAll(category?: string): Promise<Slide[]>;
    create(slide: Omit<Slide, 'id'>): Promise<Slide>;
    update(id: string, slide: Partial<Slide>): Promise<Slide>;
    remove(id: string): Promise<boolean>;
}
