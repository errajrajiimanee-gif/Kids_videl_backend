"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const products_module_1 = require("./products/products.module");
const categories_module_1 = require("./categories/categories.module");
const sliders_module_1 = require("./sliders/sliders.module");
const brands_module_1 = require("./brands/brands.module");
const orders_module_1 = require("./orders/orders.module");
const auth_module_1 = require("./auth/auth.module");
const loyalty_module_1 = require("./loyalty/loyalty.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule, categories_module_1.CategoriesModule, sliders_module_1.SlidersModule, brands_module_1.BrandsModule, orders_module_1.OrdersModule, auth_module_1.AuthModule, loyalty_module_1.LoyaltyModule]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map