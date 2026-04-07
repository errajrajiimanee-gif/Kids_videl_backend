import { Injectable } from '@nestjs/common';
import { JsonStore } from '../storage/json-store';
import { Brand } from './brand.interface';

@Injectable()
export class BrandsService {
  private store = new JsonStore<Brand>('brands.json', [
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

  async findAll(): Promise<Brand[]> {
    return await this.store.all();
  }

  async create(brand: Omit<Brand, 'id'>): Promise<Brand> {
    return await this.store.create(brand as Omit<Brand, 'id'>);
  }

  async update(id: number, brand: Partial<Brand>): Promise<Brand> {
    return await this.store.update(id, brand);
  }

  async remove(id: number): Promise<boolean> {
    return await this.store.remove(id);
  }
}
