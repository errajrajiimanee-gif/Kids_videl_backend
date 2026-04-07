import { Injectable } from '@nestjs/common';
import { JsonStore } from '../storage/json-store';
import { LoyaltyMember } from './loyalty.interface';

@Injectable()
export class LoyaltyService {
  private store = new JsonStore<LoyaltyMember>('loyalty-members.json', []);

  async findAll(): Promise<LoyaltyMember[]> {
    const members = await this.store.all();
    return members.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async findOne(id: number): Promise<LoyaltyMember> {
    return await this.store.getById(id);
  }

  async create(member: Omit<LoyaltyMember, 'id' | 'createdAt'>): Promise<LoyaltyMember> {
    const existing = await this.findByEmailOrPhone(member.email, member.phone);
    if (existing) {
      return existing; // Don't duplicate, return existing member
    }
    return await this.store.create({
      ...member,
      points: member.points || 0,
      createdAt: new Date().toISOString(),
    } as any);
  }

  async update(id: number, member: Partial<LoyaltyMember>): Promise<LoyaltyMember> {
    return await this.store.update(id, member);
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<LoyaltyMember | undefined> {
    const members = await this.store.all();
    return members.find(m => m.email === email || m.phone === phone);
  }

  async addPointsByEmailOrPhone(email: string, phone: string, points: number): Promise<LoyaltyMember | undefined> {
    const member = await this.findByEmailOrPhone(email, phone);
    if (member) {
      return await this.update(member.id, { points: member.points + points });
    }
    return undefined;
  }

  async remove(id: number): Promise<void> {
    await this.store.remove(id);
  }
}
