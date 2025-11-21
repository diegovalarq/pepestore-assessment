import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsData } from './products.data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private products: Product[];

  constructor() {
    this.products = ProductsData;
  }

  findAll(): Product[] {
    return this.products;
  }

  findAllFiltered(filter: {
    category?: string;
    order?: string;
    search?: string;
  }): Product[] {
    let result = [...this.products];

    if (filter.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === filter.category!.toLowerCase(),
      );
    }

    if (filter.search) {
      const term = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }

    switch (filter.order) {
      case 'precio_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'precio_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'alfabetico':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'categoria':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        break;
    }

    return result;
  }

  findOne(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
