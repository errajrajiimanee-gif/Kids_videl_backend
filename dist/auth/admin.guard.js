"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
const admin_token_1 = require("./admin-token");
let AdminGuard = class AdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const isProd = process.env.NODE_ENV === 'production';
        const apiKey = process.env.ADMIN_API_KEY;
        const jwtSecret = process.env.ADMIN_JWT_SECRET;
        if (!apiKey && !jwtSecret) {
            return isProd ? false : true;
        }
        const auth = request.headers['authorization'];
        if (jwtSecret && typeof auth === 'string') {
            const match = auth.match(/^Bearer\s+(.+)$/i);
            if (match && match[1]) {
                const payload = (0, admin_token_1.verifyAdminToken)({ token: match[1], secret: jwtSecret });
                if (payload)
                    return true;
            }
        }
        const providedKey = request.headers['x-admin-key'];
        if (apiKey && typeof providedKey === 'string' && providedKey === apiKey)
            return true;
        return false;
    }
};
exports.AdminGuard = AdminGuard;
exports.AdminGuard = AdminGuard = __decorate([
    (0, common_1.Injectable)()
], AdminGuard);
//# sourceMappingURL=admin.guard.js.map