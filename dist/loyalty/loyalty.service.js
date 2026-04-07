"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../storage/json-store");
let LoyaltyService = class LoyaltyService {
    constructor() {
        this.store = new json_store_1.JsonStore('loyalty-members.json', []);
    }
    async findAll() {
        const members = await this.store.all();
        return members.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    async findOne(id) {
        return await this.store.getById(id);
    }
    async create(member) {
        const existing = await this.findByEmailOrPhone(member.email, member.phone);
        if (existing) {
            return existing;
        }
        return await this.store.create({
            ...member,
            points: member.points || 0,
            createdAt: new Date().toISOString(),
        });
    }
    async update(id, member) {
        return await this.store.update(id, member);
    }
    async findByEmailOrPhone(email, phone) {
        const members = await this.store.all();
        return members.find(m => m.email === email || m.phone === phone);
    }
    async addPointsByEmailOrPhone(email, phone, points) {
        const member = await this.findByEmailOrPhone(email, phone);
        if (member) {
            return await this.update(member.id, { points: member.points + points });
        }
        return undefined;
    }
    async remove(id) {
        await this.store.remove(id);
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)()
], LoyaltyService);
//# sourceMappingURL=loyalty.service.js.map