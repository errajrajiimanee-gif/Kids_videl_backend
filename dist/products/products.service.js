"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../storage/json-store");
let ProductsService = class ProductsService {
    constructor() {
        this.store = new json_store_1.JsonStore('products.json', [
            {
                id: 1,
                name: 'Pack WaterWipes x9 - Lingettes Bébé',
                description: 'Lingettes à base d\'eau pure, sans produits chimiques.',
                price: 439,
                image: 'https://images.unsplash.com/photo-1599490659223-e153c07dc4c4?w=400&q=80',
                category: 'HYGIÈNE & SOIN',
                subCategory: 'Lingettes',
                brandId: 5,
                sex: 'Unisexe',
                ageGroup: '0-6m'
            },
            {
                id: 2,
                name: 'Ensemble Beldi Enfant - Ramadan Edition',
                description: 'Tenue traditionnelle marocaine pour enfant.',
                price: 350,
                image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
                category: 'VÊTEMENTS',
                subCategory: 'Enfants (4-12 ans)',
                brandId: 6,
                sex: 'Unisexe',
                ageGroup: '7-12a'
            },
            {
                id: 3,
                name: 'Coffret Déco Ramadan - Table Festive',
                description: 'Ensemble de décoration pour la table du Ftour.',
                price: 180,
                image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80',
                category: 'FÊTES',
                subCategory: 'Décoration',
                brandId: 3,
                sex: 'Unisexe',
                ageGroup: 'Adulte'
            },
            {
                id: 4,
                name: 'LunchBox Isotherme - Motifs Animaux',
                description: 'Garde les repas au chaud pour l\'école.',
                price: 125,
                image: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=400&q=80',
                category: 'ÉCOLE',
                subCategory: 'Lunchbox',
                brandId: 2,
                sex: 'Unisexe',
                ageGroup: '4-6a'
            },
            {
                id: 5,
                name: 'Brosse à dents électrique Bébé',
                description: 'Douce pour les gencives sensibles.',
                price: 89,
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
                category: 'PARAPHARMACIE',
                subCategory: 'HYGIÈNE DENTAIRE',
                brandId: 8,
                sex: 'Unisexe',
                ageGroup: '1-3a'
            },
            {
                id: 6,
                name: 'Crème hydratante bébé - Peaux sensibles',
                description: 'Hydrate et protège la peau délicate du bébé.',
                price: 149,
                image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&q=80',
                category: 'PARAPHARMACIE',
                subCategory: 'Crèmes & Soins Hydratants',
                brandId: 1,
                sex: 'Unisexe',
                ageGroup: '0-6m'
            },
            {
                id: 7,
                name: 'Gel lavant doux - Corps & cheveux',
                description: 'Nettoie en douceur sans piquer les yeux.',
                price: 119,
                image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80',
                category: 'HYGIÈNE & SOIN',
                subCategory: 'Bain & douche',
                brandId: 7,
                sex: 'Unisexe',
                ageGroup: '6-12m'
            },
            {
                id: 8,
                name: 'Biberon anti-colique 270ml',
                description: 'Tétine souple, réduit les coliques.',
                price: 95,
                image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=400&q=80',
                category: 'REPAS',
                subCategory: 'Biberons',
                brandId: 6,
                sex: 'Unisexe',
                ageGroup: '0-6m'
            },
            {
                id: 9,
                name: 'Pyjama coton - Fille',
                description: 'Pyjama confortable en coton doux.',
                price: 129,
                image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&q=80',
                category: 'VÊTEMENTS',
                subCategory: 'Bébés (0-3 ans)',
                brandId: 9,
                sex: 'Fille',
                ageGroup: '6-12m'
            },
            {
                id: 10,
                name: 'Pyjama coton - Garçon',
                description: 'Pyjama confortable en coton doux.',
                price: 129,
                image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&q=80',
                category: 'VÊTEMENTS',
                subCategory: 'Bébés (0-3 ans)',
                brandId: 9,
                sex: 'Garçon',
                ageGroup: '6-12m'
            },
            {
                id: 11,
                name: 'Sac à dos maternelle',
                description: 'Petit sac léger pour l’école.',
                price: 179,
                image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
                category: 'ÉCOLE',
                subCategory: 'Sacs',
                brandId: 4,
                sex: 'Unisexe',
                ageGroup: '4-6a'
            },
            {
                id: 12,
                name: 'Crème solaire SPF50+',
                description: 'Haute protection pour peaux sensibles.',
                price: 169,
                image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80',
                category: 'PARAPHARMACIE',
                subCategory: 'Protections Solaires',
                brandId: 2,
                sex: 'Unisexe',
                ageGroup: 'Adulte'
            }
        ]);
    }
    async findAll(filters) {
        const products = await this.store.all();
        const normalize = (value) => value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        let result = products;
        if (filters?.category) {
            const c = normalize(filters.category);
            result = result.filter(p => normalize(p.category) === c);
        }
        if (filters?.subCategory) {
            const s = normalize(filters.subCategory);
            result = result.filter(p => (p.subCategory ? normalize(p.subCategory) : '') === s);
        }
        if (filters?.sex) {
            const sex = normalize(filters.sex);
            result = result.filter(p => (p.sex ? normalize(p.sex) : '') === sex);
        }
        if (filters?.ageGroup) {
            const age = normalize(filters.ageGroup);
            result = result.filter(p => (p.ageGroup ? normalize(p.ageGroup) : '') === age);
        }
        if (filters?.brandId) {
            const id = Number(filters.brandId);
            if (!Number.isNaN(id))
                result = result.filter(p => p.brandId === id);
        }
        if (filters?.minPrice) {
            const min = Number(filters.minPrice);
            if (!Number.isNaN(min))
                result = result.filter(p => p.price >= min);
        }
        if (filters?.maxPrice) {
            const max = Number(filters.maxPrice);
            if (!Number.isNaN(max))
                result = result.filter(p => p.price <= max);
        }
        return result;
    }
    async findOne(id) {
        return await this.store.getById(id);
    }
    async create(product) {
        return await this.store.create(product);
    }
    async update(id, product) {
        return await this.store.update(id, product);
    }
    async remove(id) {
        return await this.store.remove(id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map