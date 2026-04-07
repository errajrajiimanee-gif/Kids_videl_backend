"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../storage/json-store");
let BrandsService = class BrandsService {
    constructor() {
        this.store = new json_store_1.JsonStore('brands.json', [
            {
                id: 1,
                name: 'Mustela',
                logo: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&q=80',
            },
            {
                id: 2,
                name: 'Avène',
                logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80',
            },
            {
                id: 3,
                name: 'Chicco',
                logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&q=80',
            },
            {
                id: 4,
                name: 'Addax',
                logo: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=200&q=80',
            },
            {
                id: 5,
                name: 'WaterWipes',
                logo: 'https://images.unsplash.com/photo-1599490659223-e153c07dc4c4?w=200&q=80',
            },
            {
                id: 6,
                name: 'Dodie',
                logo: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=200&q=80',
            },
            {
                id: 7,
                name: 'Nivea',
                logo: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&q=80',
            },
            {
                id: 8,
                name: 'ACM',
                logo: 'https://images.unsplash.com/photo-1556228515-919086f74644?w=200&q=80',
            },
            {
                id: 9,
                name: 'KIDS',
                logo: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=200&q=80',
            },
        ]);
    }
    async findAll() {
        return await this.store.all();
    }
    async create(brand) {
        return await this.store.create(brand);
    }
    async update(id, brand) {
        return await this.store.update(id, brand);
    }
    async remove(id) {
        return await this.store.remove(id);
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)()
], BrandsService);
//# sourceMappingURL=brands.service.js.map