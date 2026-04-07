"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidersService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../storage/json-store");
let SlidersService = class SlidersService {
    constructor() {
        this.store = new json_store_1.JsonStore('sliders.json', [
            {
                id: 1,
                title: 'Exclusivité web',
                subtitle: 'Découvrez notre nouvelle collection 2026',
                image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80',
                buttonText: 'Découvrir',
                link: '/products',
                category: 'RAMADAN',
            },
            {
                id: 2,
                title: 'Tout pour les Bébés',
                subtitle: 'Vêtements, jouets, et accessoires de puériculture.',
                image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1600&q=80',
                buttonText: 'Voir la collection',
                link: '/products?category=vêtements',
                category: 'VÊTEMENTS',
            },
            {
                id: 3,
                title: 'Parapharmacie',
                subtitle: 'Soins, hygiène et bien-être pour toute la famille.',
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80',
                buttonText: 'Explorer',
                link: '/products?category=parapharmacie',
                category: 'PARAPHARMACIE',
            },
        ]);
    }
    async findAll(category) {
        const slides = await this.store.all();
        if (category) {
            const normalize = (value) => value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            const normalizedCategory = normalize(category);
            return slides.filter(s => s.category && normalize(s.category) === normalizedCategory);
        }
        return slides;
    }
    async create(slide) {
        return await this.store.create(slide);
    }
    async update(id, slide) {
        return await this.store.update(id, slide);
    }
    async remove(id) {
        return await this.store.remove(id);
    }
};
exports.SlidersService = SlidersService;
exports.SlidersService = SlidersService = __decorate([
    (0, common_1.Injectable)()
], SlidersService);
//# sourceMappingURL=sliders.service.js.map