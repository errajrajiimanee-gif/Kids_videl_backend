"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../auth/admin.guard");
const customer_guard_1 = require("../auth/customer.guard");
const orders_notifications_1 = require("./orders.notifications");
const orders_service_1 = require("./orders.service");
const products_service_1 = require("../products/products.service");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const users_service_1 = require("../users/users.service");
let OrdersController = class OrdersController {
    constructor(ordersService, productsService, loyaltyService, usersService) {
        this.ordersService = ordersService;
        this.productsService = productsService;
        this.loyaltyService = loyaltyService;
        this.usersService = usersService;
    }
    async findAll() {
        return this.ordersService.findAll();
    }
    async findMyOrders(req) {
        const userId = req.user.uid;
        const user = await this.usersService.findById(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const allOrders = await this.ordersService.findAll();
        return allOrders.filter(o => o.customer.email === user.email || (user.phone && o.customer.phone === user.phone));
    }
    async findOne(id) {
        return this.ordersService.findOne(+id);
    }
    async updateStatus(id, body) {
        const status = body?.status;
        if (status !== 'pending' && status !== 'confirmed' && status !== 'cancelled') {
            throw new common_1.BadRequestException('Statut invalide');
        }
        return this.ordersService.update(+id, { status });
    }
    async create(body) {
        const requireEmailNotification = process.env.REQUIRE_EMAIL_NOTIFICATION === 'true';
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpFrom = process.env.SMTP_FROM || smtpUser;
        const smtpConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom);
        if (requireEmailNotification && !smtpConfigured) {
            throw new common_1.ServiceUnavailableException('Email non configuré (SMTP)');
        }
        const rawItems = body.items || [];
        if (!Array.isArray(rawItems) || rawItems.length === 0) {
            throw new common_1.BadRequestException('Panier vide');
        }
        const customer = body.customer || {};
        const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'phone'];
        const missing = requiredFields.filter(key => !String(customer[key] || '').trim());
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Champs obligatoires manquants: ${missing.join(', ')}`);
        }
        const paymentMethod = body.paymentMethod || 'cod';
        if (paymentMethod !== 'cod' && paymentMethod !== 'card') {
            throw new common_1.BadRequestException('Méthode de paiement invalide');
        }
        const shippingMethod = body.shippingMethod;
        const shippingCost = shippingMethod === 'casablanca' ? 20 : 40;
        const invalidItem = rawItems.find(i => !i || typeof i.productId !== 'number' || typeof i.quantity !== 'number' || i.quantity <= 0);
        if (invalidItem)
            throw new common_1.BadRequestException('Articles invalides');
        const items = [];
        for (const raw of rawItems) {
            const product = await this.productsService.findOne(raw.productId);
            if (!product)
                throw new common_1.BadRequestException('Produit introuvable');
            items.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: raw.quantity,
            });
        }
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const total = subtotal + shippingCost;
        const earnedPoints = Math.floor(subtotal / 10);
        if (earnedPoints > 0 && customer.email && customer.phone) {
            await this.loyaltyService.addPointsByEmailOrPhone(customer.email, customer.phone, earnedPoints);
        }
        const created = await this.ordersService.create({
            createdAt: new Date().toISOString(),
            status: 'pending',
            currency: body.currency || 'MAD',
            paymentMethod: paymentMethod,
            shippingMethod: shippingMethod,
            shippingCost,
            subtotal,
            total,
            customer,
            items,
        });
        let notify;
        try {
            notify = await (0, orders_notifications_1.notifyAdmin)(created);
        }
        catch (e) {
            if (requireEmailNotification) {
                await this.ordersService.update(created.id, { status: 'cancelled' });
                throw new common_1.ServiceUnavailableException('Échec envoi email');
            }
            notify = { email: false, whatsapp: false, ...(0, orders_notifications_1.buildNotifyPreview)(created) };
        }
        return { order: created, notify };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-orders'),
    (0, common_1.UseGuards)(customer_guard_1.CustomerGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findMyOrders", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        products_service_1.ProductsService,
        loyalty_service_1.LoyaltyService,
        users_service_1.UsersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map