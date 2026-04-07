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
exports.CustomerAuthController = void 0;
const common_1 = require("@nestjs/common");
const https = require("https");
const crypto = require("crypto");
const users_service_1 = require("../users/users.service");
const customer_password_1 = require("./customer-password");
const customer_token_1 = require("./customer-token");
const customer_guard_1 = require("./customer.guard");
const loyalty_service_1 = require("../loyalty/loyalty.service");
const mail_service_1 = require("./mail.service");
async function getGoogleUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
        https.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                }
                catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
const isEmailLike = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
let CustomerAuthController = class CustomerAuthController {
    constructor(usersService, loyaltyService, mailService) {
        this.usersService = usersService;
        this.loyaltyService = loyaltyService;
        this.mailService = mailService;
    }
    async googleLogin(body) {
        const accessToken = body?.token;
        if (!accessToken)
            throw new common_1.BadRequestException('Token Google requis');
        try {
            const googleUser = await getGoogleUserInfo(accessToken);
            if (!googleUser.email)
                throw new common_1.UnauthorizedException('Email Google non trouvé');
            let user = await this.usersService.findByEmail(googleUser.email);
            if (!user) {
                user = await this.usersService.create({
                    createdAt: new Date().toISOString(),
                    email: googleUser.email,
                    passwordHash: '',
                    firstName: googleUser.given_name || undefined,
                    lastName: googleUser.family_name || undefined,
                });
                await this.loyaltyService.create({
                    firstName: googleUser.given_name || '',
                    lastName: googleUser.family_name || '',
                    email: googleUser.email,
                    phone: '',
                    points: 0
                });
            }
            const secret = process.env.CUSTOMER_JWT_SECRET;
            const ttlSeconds = process.env.CUSTOMER_TOKEN_TTL_SECONDS ? Number(process.env.CUSTOMER_TOKEN_TTL_SECONDS) : 60 * 60 * 24 * 7;
            if (!secret)
                throw new common_1.ServiceUnavailableException('Auth client non configurée');
            const token = (0, customer_token_1.createCustomerToken)({ userId: user.id, email: user.email, secret, ttlSeconds });
            const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
            return { token, expiresAt, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
        }
        catch (err) {
            console.error('Google verification error:', err);
            throw new common_1.UnauthorizedException('Validation Google échouée');
        }
    }
    async register(body) {
        const email = (body?.email || '').trim().toLowerCase();
        const password = (body?.password || '').trim();
        const firstName = (body?.firstName || '').trim();
        const lastName = (body?.lastName || '').trim();
        if (!email || !isEmailLike(email))
            throw new common_1.BadRequestException('Email invalide');
        if (password.length < 8)
            throw new common_1.BadRequestException('Mot de passe trop court');
        const existing = await this.usersService.findByEmail(email);
        if (existing)
            throw new common_1.BadRequestException('Email déjà utilisé');
        const secret = process.env.CUSTOMER_JWT_SECRET;
        const ttlSeconds = process.env.CUSTOMER_TOKEN_TTL_SECONDS ? Number(process.env.CUSTOMER_TOKEN_TTL_SECONDS) : 60 * 60 * 24 * 7;
        if (!secret)
            throw new common_1.ServiceUnavailableException('Auth client non configurée');
        if (Number.isNaN(ttlSeconds) || ttlSeconds < 60)
            throw new common_1.ServiceUnavailableException('Auth client non configurée');
        const passwordHash = await (0, customer_password_1.hashPassword)(password);
        const user = await this.usersService.create({
            createdAt: new Date().toISOString(),
            email,
            passwordHash,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
        });
        await this.loyaltyService.create({
            firstName: firstName || '',
            lastName: lastName || '',
            email,
            phone: '',
            points: 0
        });
        const token = (0, customer_token_1.createCustomerToken)({ userId: user.id, email: user.email, secret, ttlSeconds });
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
        return { token, expiresAt, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
    }
    async login(body) {
        const email = (body?.email || '').trim().toLowerCase();
        const password = (body?.password || '').trim();
        if (!email || !isEmailLike(email))
            throw new common_1.BadRequestException('Email invalide');
        if (!password)
            throw new common_1.BadRequestException('Mot de passe requis');
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const ok = await (0, customer_password_1.verifyPassword)({ password, storedHash: user.passwordHash });
        if (!ok)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const secret = process.env.CUSTOMER_JWT_SECRET;
        const ttlSeconds = process.env.CUSTOMER_TOKEN_TTL_SECONDS ? Number(process.env.CUSTOMER_TOKEN_TTL_SECONDS) : 60 * 60 * 24 * 7;
        if (!secret)
            throw new common_1.ServiceUnavailableException('Auth client non configurée');
        if (Number.isNaN(ttlSeconds) || ttlSeconds < 60)
            throw new common_1.ServiceUnavailableException('Auth client non configurée');
        const token = (0, customer_token_1.createCustomerToken)({ userId: user.id, email: user.email, secret, ttlSeconds });
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
        return { token, expiresAt, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
    }
    async me(request) {
        const uid = request?.user?.uid;
        if (typeof uid !== 'number')
            throw new common_1.UnauthorizedException('Non autorisé');
        const user = await this.usersService.findById(uid);
        if (!user)
            throw new common_1.UnauthorizedException('Non autorisé');
        const loyaltyMember = await this.loyaltyService.findByEmailOrPhone(user.email, user.phone || '');
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            points: loyaltyMember?.points || 0
        };
    }
    async forgotPassword(body) {
        const email = (body?.email || '').trim().toLowerCase();
        if (!email || !isEmailLike(email))
            throw new common_1.BadRequestException('Email invalide');
        const user = await this.usersService.findByEmail(email);
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 1);
            await this.usersService.update(user.id, {
                resetToken: token,
                resetTokenExpires: expires.toISOString()
            });
            const baseUrl = process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5173';
            const resetLink = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${token}`;
            await this.mailService.sendResetPasswordEmail(email, resetLink);
        }
        return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
    }
    async resetPassword(body) {
        const { token, password } = body;
        if (!token || !password)
            throw new common_1.BadRequestException('Données manquantes');
        if (password.length < 8)
            throw new common_1.BadRequestException('Mot de passe trop court');
        const user = await this.usersService.findByResetToken(token);
        if (!user)
            throw new common_1.BadRequestException('Token invalide');
        if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
            throw new common_1.BadRequestException('Token expiré');
        }
        const passwordHash = await (0, customer_password_1.hashPassword)(password);
        await this.usersService.update(user.id, {
            passwordHash,
            resetToken: undefined,
            resetTokenExpires: undefined
        });
        return { message: 'Mot de passe réinitialisé avec succès.' };
    }
};
exports.CustomerAuthController = CustomerAuthController;
__decorate([
    (0, common_1.Post)('google-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(customer_guard_1.CustomerGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "resetPassword", null);
exports.CustomerAuthController = CustomerAuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        loyalty_service_1.LoyaltyService,
        mail_service_1.MailService])
], CustomerAuthController);
//# sourceMappingURL=customer-auth.controller.js.map