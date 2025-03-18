import { ProductItemDto } from "../dto/create-cart.dto";

export interface ProductResponse extends ProductItemDto {
  title: string;
  stock: number;
  rating: number;
  length: number;
  height: number;
  depth: number;
}