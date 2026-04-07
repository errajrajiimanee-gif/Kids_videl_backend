"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../storage/json-store");
let UsersService = class UsersService {
    constructor() {
        this.store = new json_store_1.JsonStore('users.json', []);
    }
    async findByEmail(email) {
        const all = await this.store.all();
        const normalized = email.trim().toLowerCase();
        return all.find(u => u.email.toLowerCase() === normalized);
    }
    async findById(id) {
        return await this.store.getById(id);
    }
    async create(user) {
        return await this.store.create(user);
    }
    async update(id, user) {
        return await this.store.update(id, user);
    }
    async findByResetToken(token) {
        const all = await this.store.all();
        return all.find(u => u.resetToken === token);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map