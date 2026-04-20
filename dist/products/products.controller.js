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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const admin_guard_1 = require("../auth/admin.guard");
const MAX_DATA_URI_LENGTH = 200_000;
const assertImageOk = (value, fieldName) => {
    if (typeof value !== 'string')
        return;
    const v = value.trim();
    if (!v.startsWith('data:image'))
        return;
    if (v.length > MAX_DATA_URI_LENGTH) {
        throw new common_1.BadRequestException(`${fieldName}: image trop lourde. Utilisez une URL ou une image plus légère.`);
    }
};
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    async findAll(category, subCategory, sex, ageGroup, brandId, minPrice, maxPrice) {
        return this.productsService.findAll({ category, subCategory, sex, ageGroup, brandId, minPrice, maxPrice });
    }
    async findOne(id) {
        return this.productsService.findOne(+id);
    }
    async create(product) {
        assertImageOk(product?.image, 'image');
        return this.productsService.create(product);
    }
    async update(id, product) {
        assertImageOk(product?.image, 'image');
        return this.productsService.update(+id, product);
    }
    async remove(id) {
        return this.productsService.remove(+id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('subCategory')),
    __param(2, (0, common_1.Query)('sex')),
    __param(3, (0, common_1.Query)('ageGroup')),
    __param(4, (0, common_1.Query)('brandId')),
    __param(5, (0, common_1.Query)('minPrice')),
    __param(6, (0, common_1.Query)('maxPrice')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map