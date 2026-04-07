import { LoyaltyMember } from './loyalty.interface';
import { LoyaltyService } from './loyalty.service';
export declare class LoyaltyController {
    private readonly loyaltyService;
    constructor(loyaltyService: LoyaltyService);
    findAll(): Promise<LoyaltyMember[]>;
    create(body: Omit<LoyaltyMember, 'id' | 'createdAt'>): Promise<LoyaltyMember>;
    update(id: string, body: Partial<LoyaltyMember>): Promise<LoyaltyMember>;
    remove(id: string): Promise<void>;
}
