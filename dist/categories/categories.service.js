"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const json_store_1 = require("../storage/json-store");
let CategoriesService = class CategoriesService {
    constructor() {
        this.store = new json_store_1.JsonStore('categories.json', [
            {
                id: 1,
                name: 'RAMADAN',
                image: 'https://images.unsplash.com/photo-1524169358666-79f22534bc6e?w=1200&q=80',
                subCategories: [],
                displayType: 'highlight',
                color: '#b68e59',
            },
            {
                id: 2,
                name: 'PARAPHARMACIE',
                image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80',
                subCategories: [
                    { id: 101, name: 'Crèmes & Soins Hydratants', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&q=80' },
                    { id: 102, name: 'Nettoyants & Démaquillants', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80' },
                    { id: 103, name: 'Protections Solaires', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80' },
                    { id: 104, name: 'Soins des Lèvres', image: 'https://images.unsplash.com/photo-1611930022263-83b3673d299c?w=800&q=80' },
                    { id: 105, name: 'Soins Anti-taches & Éclaircissants', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80' },
                    { id: 106, name: 'Soins Anti-âge', image: 'https://images.unsplash.com/photo-1611930022210-6f14ccf2f8b5?w=800&q=80' },
                ],
            },
            {
                id: 3,
                name: 'POUR ELLE',
                image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1200&q=80',
                subCategories: [
                    { id: 201, name: 'Soins du Visage', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' },
                    { id: 202, name: 'Soins du Corps', image: 'https://images.unsplash.com/photo-1556228515-919086f74644?w=800&q=80' },
                    { id: 203, name: 'Maquillage', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80' },
                    { id: 204, name: 'Parfums', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80' },
                ],
            },
            {
                id: 4,
                name: 'VÊTEMENTS',
                image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
                subCategories: [
                    { id: 301, name: 'Bébés (0-3 ans)', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80' },
                    { id: 302, name: 'Enfants (4-12 ans)', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80' },
                    { id: 303, name: 'Accessoires', image: 'https://images.unsplash.com/photo-1520975958225-8c3024d6c5b6?w=800&q=80' },
                ],
            },
            {
                id: 5,
                name: 'JOUETS',
                image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&q=80',
                subCategories: [],
            },
            {
                id: 6,
                name: 'LIVRES',
                image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
                subCategories: [],
            },
            {
                id: 7,
                name: 'HYGIÈNE & SOIN',
                image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80',
                subCategories: [
                    { id: 701, name: 'Lingettes', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80' },
                    { id: 702, name: 'Bain & douche', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&q=80' },
                    { id: 703, name: 'Shampooing', image: 'https://images.unsplash.com/photo-1611930022210-6f14ccf2f8b5?w=800&q=80' },
                    { id: 704, name: 'HYGIÈNE DENTAIRE', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80' },
                ],
            },
            {
                id: 8,
                name: 'REPAS',
                image: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=1200&q=80',
                subCategories: [
                    { id: 801, name: 'Biberons', image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=800&q=80' },
                    { id: 802, name: 'Tétines', image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=800&q=80' },
                    { id: 803, name: 'Chaises & accessoires', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80' },
                    { id: 804, name: 'Vaisselle bébé', image: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&q=80' },
                ],
            },
            {
                id: 9,
                name: 'SORTIES',
                image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80',
                subCategories: [],
            },
            {
                id: 10,
                name: 'CHAMBRE',
                image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=1200&q=80',
                subCategories: [],
            },
            {
                id: 11,
                name: 'ÉCOLE',
                image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
                subCategories: [
                    { id: 1101, name: 'Sacs', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80' },
                    { id: 1102, name: 'Lunchbox', image: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&q=80' },
                    { id: 1103, name: 'Gourdes', image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80' },
                    { id: 1104, name: 'Papeterie', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80' },
                ],
            },
            {
                id: 12,
                name: 'PLEIN AIR',
                image: 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?w=1200&q=80',
                subCategories: [],
            },
            {
                id: 13,
                name: 'FÊTES',
                image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80',
                subCategories: [
                    { id: 1301, name: 'Décoration', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80' },
                    { id: 1302, name: 'Cadeaux', image: 'https://images.unsplash.com/photo-1509817316-9085b7eea1a8?w=800&q=80' },
                    { id: 1303, name: 'Table & accessoires', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80' },
                ],
            },
            {
                id: 14,
                name: 'BLADY',
                image: 'https://images.unsplash.com/photo-1509817316-9085b7eea1a8?w=1200&q=80',
                subCategories: [],
                displayType: 'flag',
            },
            {
                id: 15,
                name: 'SOLDES',
                image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
                subCategories: [],
                displayType: 'sale',
            },
        ]);
    }
    async findAll() {
        return await this.store.all();
    }
    async create(category) {
        return await this.store.create(category);
    }
    async update(id, category) {
        return await this.store.update(id, category);
    }
    async remove(id) {
        return await this.store.remove(id);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)()
], CategoriesService);
//# sourceMappingURL=categories.service.js.map