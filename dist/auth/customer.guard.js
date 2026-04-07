"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerGuard = void 0;
const common_1 = require("@nestjs/common");
const customer_token_1 = require("./customer-token");
let CustomerGuard = class CustomerGuard {
    canActivate(context) {
        const secret = process.env.CUSTOMER_JWT_SECRET;
        if (!secret)
            return process.env.NODE_ENV === 'production' ? false : true;
        const request = context.switchToHttp().getRequest();
        const auth = request.headers['authorization'];
        if (typeof auth !== 'string')
            return false;
        const match = auth.match(/^Bearer\s+(.+)$/i);
        if (!match || !match[1])
            return false;
        const payload = (0, customer_token_1.verifyCustomerToken)({ token: match[1], secret });
        if (!payload)
            return false;
        request.user = payload;
        return true;
    }
};
exports.CustomerGuard = CustomerGuard;
exports.CustomerGuard = CustomerGuard = __decorate([
    (0, common_1.Injectable)()
], CustomerGuard);
//# sourceMappingURL=customer.guard.js.map