import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { DummyJsonService } from './services/dummy-json.service';
import { ProductResponse } from './interfaces/productResponse.interface';
import { ProductWithRealStock } from './interfaces/productWithRealStock.interfaces';
import { StockVerificationResult } from './interfaces/stockVerificationResult.interface';
import { ShippingRequestAdapter } from './adapters/tariff.adapter';
import { ShippingRateService } from './services/ShippingRate.service';




@Injectable()
export class CartService {

  constructor(
    private readonly dummyJsonService: DummyJsonService,
    private readonly shippingAdapter: ShippingRequestAdapter,
    private readonly shippingService: ShippingRateService,
  ) {}


  private verifyStockAvailability(products: ProductWithRealStock[]): StockVerificationResult {
    const insufficientStockProducts = products.filter(
      product => product.realStock == 0
    );
    const hasEnoughStock = insufficientStockProducts.length === 0;
    
    let message = hasEnoughStock 
      ? 'Todos los productos tienen stock suficiente' 
      : 'Stock insuficiente para algunos productos';
    
    return {
      success: hasEnoughStock,
      message,
      insufficientItems: insufficientStockProducts
    };
  }

  private calculateRealStock(products: ProductResponse[]): ProductWithRealStock[] {
    return products.map(product => {
      const totalStock = product.stock;
      const rating = product.rating;
      let realStock = 0
      if (rating != 0) {
        realStock = Math.floor(totalStock / rating);
      }
      
      return {
        ...product,
        realStock,
      };
    });
  }

  async create(createCartDto: CreateCartDto) {
    const enrichedProducts = await this.dummyJsonService.enrichProductsWithDetails(createCartDto.products);
    const productsWithRealStock = this.calculateRealStock(enrichedProducts);
    const stockVerification = this.verifyStockAvailability(productsWithRealStock);

    if (!stockVerification.success) {
      throw new HttpException({
        message: stockVerification.message,
        insufficientItems: stockVerification.insufficientItems
      }, HttpStatus.BAD_REQUEST);
    }
    console.log(productsWithRealStock)

    const shippingRequest = this.shippingAdapter.adaptToShippingRequest(
      createCartDto.customer_data,
      productsWithRealStock
    );
    const shippingRate = await this.shippingService.getBestRate(shippingRequest);
    
    if (!shippingRate.success) {
      throw new HttpException({
        message: shippingRate.error,
      }, HttpStatus.BAD_REQUEST);
    }

    return {
      courier: shippingRate.provider,
      price: shippingRate.price
    };
  }
}
