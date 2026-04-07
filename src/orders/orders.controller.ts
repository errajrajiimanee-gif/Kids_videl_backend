import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, ServiceUnavailableException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { CustomerGuard } from '../auth/customer.guard';
import { Order } from './order.interface';
import { buildNotifyPreview, notifyAdmin } from './orders.notifications';
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

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly loyaltyService: LoyaltyService,
    private readonly usersService: UsersService
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('my-orders')
  @UseGuards(CustomerGuard)
  async findMyOrders(@Req() req: any): Promise<any[]> {
    const userId = req.user.uid;
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    
    const allOrders = await this.ordersService.findAll();
    // Filter orders by email or phone
    return allOrders.filter(o => o.customer.email === user.email || (user.phone && o.customer.phone === user.phone));
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusBody): Promise<Order> {
    const status = body?.status;
    if (status !== 'pending' && status !== 'confirmed' && status !== 'cancelled') {
      throw new BadRequestException('Statut invalide');
    }
    return this.ordersService.update(+id, { status });
  }

  @Post()
  async create(@Body() body: CreateOrderBody): Promise<{
    order: Order;
    notify: Awaited<ReturnType<typeof notifyAdmin>>;
  }> {
    const requireEmailNotification = process.env.REQUIRE_EMAIL_NOTIFICATION === 'true';
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    const smtpConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom);
    if (requireEmailNotification && !smtpConfigured) {
      throw new ServiceUnavailableException('Email non configuré (SMTP)');
    }

    const rawItems = body.items || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new BadRequestException('Panier vide');
    }

    const customer = body.customer || {};
    const requiredFields: Array<keyof Order['customer']> = ['email', 'firstName', 'lastName', 'address', 'city', 'phone'];
    const missing = requiredFields.filter(key => !String(customer[key] || '').trim());
    if (missing.length > 0) {
      throw new BadRequestException(`Champs obligatoires manquants: ${missing.join(', ')}`);
    }

    const paymentMethod = body.paymentMethod || 'cod';
    if (paymentMethod !== 'cod' && paymentMethod !== 'card') {
      throw new BadRequestException('Méthode de paiement invalide');
    }

    const shippingMethod = body.shippingMethod;
    const shippingCost = shippingMethod === 'casablanca' ? 20 : 40;

    const invalidItem = rawItems.find(i => !i || typeof i.productId !== 'number' || typeof i.quantity !== 'number' || i.quantity <= 0);
    if (invalidItem) throw new BadRequestException('Articles invalides');

    const items: Order['items'] = [];
    for (const raw of rawItems) {
      const product = await this.productsService.findOne(raw.productId);
      if (!product) throw new BadRequestException('Produit introuvable');
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: raw.quantity,
      });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal + shippingCost;

    // Loyalty points logic: 1 point per 10 MAD of subtotal
    const earnedPoints = Math.floor(subtotal / 10);
    if (earnedPoints > 0 && customer.email && customer.phone) {
      await this.loyaltyService.addPointsByEmailOrPhone(customer.email, customer.phone, earnedPoints);
    }

    const created = await this.ordersService.create({
      createdAt: new Date().toISOString(),
      status: 'pending',
      currency: body.currency || 'MAD',
      paymentMethod: paymentMethod as any,
      shippingMethod: shippingMethod as any,
      shippingCost,
      subtotal,
      total,
      customer,
      items,
    });

    let notify: Awaited<ReturnType<typeof notifyAdmin>>;
    try {
      notify = await notifyAdmin(created);
    } catch (e) {
      if (requireEmailNotification) {
        await this.ordersService.update(created.id, { status: 'cancelled' });
        throw new ServiceUnavailableException('Échec envoi email');
      }
      notify = { email: false, whatsapp: false, ...buildNotifyPreview(created) } as unknown as Awaited<ReturnType<typeof notifyAdmin>>;
    }
    return { order: created, notify };
  }
}
