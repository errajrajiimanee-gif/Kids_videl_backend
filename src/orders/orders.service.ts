import { Injectable } from '@nestjs/common';
import { JsonStore } from '../storage/json-store';
import { Order } from './order.interface';

@Injectable()
export class OrdersService {
  private store = new JsonStore<Order>('orders.json', []);

  async findAll(): Promise<Order[]> {
    const orders = await this.store.all();
    return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async findOne(id: number): Promise<Order> {
    return await this.store.getById(id);
  }

  async create(order: Omit<Order, 'id'>): Promise<Order> {
    return await this.store.create(order as Omit<Order, 'id'>);
  }

  async update(id: number, order: Partial<Order>): Promise<Order> {
    return await this.store.update(id, order);
  }
}

