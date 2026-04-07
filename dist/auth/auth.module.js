"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const admin_auth_controller_1 = require("./admin-auth.controller");
const customer_auth_controller_1 = require("./customer-auth.controller");
const users_module_1 = require("../users/users.module");
const loyalty_module_1 = require("../loyalty/loyalty.module");
const mail_service_1 = require("./mail.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, loyalty_module_1.LoyaltyModule],
        controllers: [admin_auth_controller_1.AdminAuthController, customer_auth_controller_1.CustomerAuthController],
        providers: [mail_service_1.MailService],
        exports: [mail_service_1.MailService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map