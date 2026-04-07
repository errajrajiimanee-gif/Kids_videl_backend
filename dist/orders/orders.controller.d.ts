import { Order } from './order.interface';
import { notifyAdmin } from './orders.notifications';
import { OrdersService } from './orders.service';
import { ProductsService } from '../products/products.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { UsersService } from '../users/users.service';
type CreateOrderBody = {
    customer?: Order['customer'];
    items: Order['items'];
    shippingCost: number;
    shippingMethod: Order['shippingMethod'];
    paymentMethod?: Order['paymentMethod'];
    currency?: Order['currency'];
};
type UpdateOrderStatusBody = {
    status: Order['status'];
};
export declare class OrdersController {
    private readonly ordersService;
    private readonly productsService;
    private readonly loyaltyService;
    private readonly usersService;
    constructor(ordersService: OrdersService, productsService: ProductsService, loyaltyService: LoyaltyService, usersService: UsersService);
    findAll(): Promise<Order[]>;
    findMyOrders(req: any): Promise<any[]>;
    findOne(id: string): Promise<Order>;
    updateStatus(id: string, body: UpdateOrderStatusBody): Promise<Order>;
    create(body: CreateOrderBody): Promise<{
        order: Order;
        notify: Awaited<ReturnType<typeof notifyAdmin>>;
    }>;
}
export {};
