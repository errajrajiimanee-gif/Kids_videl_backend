import { LoyaltyMember } from './loyalty.interface';
export declare class LoyaltyService {
    private store;
    findAll(): Promise<LoyaltyMember[]>;
    findOne(id: number): Promise<LoyaltyMember>;
    create(member: Omit<LoyaltyMember, 'id' | 'createdAt'>): Promise<LoyaltyMember>;
    update(id: number, member: Partial<LoyaltyMember>): Promise<LoyaltyMember>;
    findByEmailOrPhone(email: string, phone: string): Promise<LoyaltyMember | undefined>;
    addPointsByEmailOrPhone(email: string, phone: string, points: number): Promise<LoyaltyMember | undefined>;
    remove(id: number): Promise<void>;
}
