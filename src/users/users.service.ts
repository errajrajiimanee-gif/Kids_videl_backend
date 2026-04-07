import { Injectable } from '@nestjs/common';
import { JsonStore } from '../storage/json-store';
import { User } from './user.interface';

@Injectable()
export class UsersService {
  private store = new JsonStore<User>('users.json', []);

  async findByEmail(email: string): Promise<User | undefined> {
    const all = await this.store.all();
    const normalized = email.trim().toLowerCase();
    return all.find(u => u.email.toLowerCase() === normalized);
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.store.getById(id);
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    return await this.store.create(user);
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
    return await this.store.update(id, user);
  }

  async findByResetToken(token: string): Promise<User | undefined> {
    const all = await this.store.all();
    return all.find(u => u.resetToken === token);
  }
}

