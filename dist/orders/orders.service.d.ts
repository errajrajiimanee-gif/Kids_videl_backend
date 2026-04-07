import { Order } from './order.interface';
export declare class OrdersService {
    private store;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    create(order: Omit<Order, 'id'>): Promise<Order>;
    update(id: number, order: Partial<Order>): Promise<Order>;
}
