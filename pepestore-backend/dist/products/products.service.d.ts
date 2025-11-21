import { Product } from './product.entity';
export declare class ProductsService {
    private products;
    constructor();
    findAll(): Product[];
    findAllFiltered(filter: {
        category?: string;
        order?: string;
        search?: string;
    }): Product[];
    findOne(id: string): Product | undefined;
}
