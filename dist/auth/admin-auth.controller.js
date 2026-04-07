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
exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const admin_token_1 = require("./admin-token");
let AdminAuthController = class AdminAuthController {
    async login(body) {
        const username = (body?.username || '').trim();
        const password = (body?.password || '').trim();
        const envUser = process.env.ADMIN_USERNAME;
        const envPass = process.env.ADMIN_PASSWORD;
        const secret = process.env.ADMIN_JWT_SECRET;
        const ttlSeconds = process.env.ADMIN_TOKEN_TTL_SECONDS ? Number(process.env.ADMIN_TOKEN_TTL_SECONDS) : 60 * 60 * 12;
        if (!envUser || !envPass || !secret) {
            throw new common_1.ServiceUnavailableException('Admin auth non configurée');
        }
        if (Number.isNaN(ttlSeconds) || ttlSeconds < 60) {
            throw new common_1.ServiceUnavailableException('Admin auth non configurée');
        }
        if (username !== envUser || password !== envPass) {
            throw new common_1.UnauthorizedException('Identifiants invalides');
        }
        const token = (0, admin_token_1.createAdminToken)({ subject: username, secret, ttlSeconds });
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
        return { token, expiresAt };
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, common_1.Controller)('auth/admin')
], AdminAuthController);
//# sourceMappingURL=admin-auth.controller.js.map