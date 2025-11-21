import { ProductsService } from './products.service';
import { Product } from './product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string, order?: string, search?: string): Product[];
    findOne(id: string): Product | undefined;
}
