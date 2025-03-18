import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ProductItemDto } from '../dto/create-cart.dto';
import { ProductResponse } from '../interfaces/productResponse.interface';


@Injectable()
export class DummyJsonService {
  private readonly baseUrl = 'https://dummyjson.com';

  constructor(private readonly httpService: HttpService) {}

  async enrichProductsWithDetails(products: ProductItemDto[]): Promise<ProductResponse[]> {
    try {
      const enrichedProducts = await Promise.all(
        products.map(async (product) => {
          const enrichedProduct = await this.getProductDetails(product);
          return enrichedProduct;
        }),
      );

      return enrichedProducts;
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Error al obtener datos de productos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  private async getProductDetails(product: ProductItemDto): Promise<ProductResponse> {
    try {
      const { data } = await firstValueFrom(this.httpService.get(`${this.baseUrl}/products/${product.productId}`))

      return {
        ...product,
        title: data.title,
        stock: data.stock,
        rating: data.rating,
        length: data.dimensions.width,
        height: data.dimensions.height,
        depth: data.dimensions.depth
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
            ...product,
            title: 'none',
            stock: 0,
            rating: 0,
            length: 0,
            height: 0,
            depth: 0,
          };
      }
      console.log(error)
      throw new HttpException(
        `Error al obtener detalles del producto ${product.productId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}