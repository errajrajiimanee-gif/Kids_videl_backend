import { Injectable } from '@nestjs/common';
import { Slide } from './slide.interface';
import { JsonStore } from '../storage/json-store';

@Injectable()
export class SlidersService {
  private store = new JsonStore<Slide>('sliders.json', [
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

  async findAll(category?: string): Promise<Slide[]> {
    const slides = await this.store.all();
    if (category) {
      const normalize = (value: string) =>
        value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

      const normalizedCategory = normalize(category);
      return slides.filter(
        s => s.category && normalize(s.category) === normalizedCategory
      );
    }
    return slides;
  }

  async create(slide: Omit<Slide, 'id'>): Promise<Slide> {
    return await this.store.create(slide as Omit<Slide, 'id'>);
  }

  async update(id: number, slide: Partial<Slide>): Promise<Slide> {
    return await this.store.update(id, slide);
  }

  async remove(id: number): Promise<boolean> {
    return await this.store.remove(id);
  }
}
