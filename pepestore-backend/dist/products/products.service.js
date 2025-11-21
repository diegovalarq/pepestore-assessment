"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_data_1 = require("./products.data");
let ProductsService = class ProductsService {
    constructor() {
        this.products = products_data_1.ProductsData;
    }
    findAll() {
        return this.products;
    }
    findAllFiltered(filter) {
        let result = [...this.products];
        if (filter.category) {
            result = result.filter((p) => p.category.toLowerCase() === filter.category.toLowerCase());
        }
        if (filter.search) {
            const term = filter.search.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term));
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
    findOne(id) {
        return this.products.find((product) => product.id === id);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductsService);
//# sourceMappingURL=products.service.js.map