import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('categoria') category?: string,
    @Query('orden') order?: string,
    @Query('buscar') search?: string,
  ): Product[] {
    // Apply basic filtering, search, and ordering to support the catalog UI
    return this.productsService.findAllFiltered({ category, order, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product | undefined {
    return this.productsService.findOne(id);
  }
}
