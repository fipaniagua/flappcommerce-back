import { Injectable } from '@nestjs/common';
import { CustomerDataDto } from '../dto/create-cart.dto';
import { ProductWithRealStock } from '../interfaces/productWithRealStock.interfaces';
import { ShippingAddress, ShippingRequest, ShippingItem } from '../interfaces/tariffProvider.interface';


@Injectable()
export class ShippingRequestAdapter {
  adaptToShippingRequest(
    customerData: CustomerDataDto, 
    products: ProductWithRealStock[],
    pickupAddress?: Partial<ShippingAddress>
  ): ShippingRequest {
    
    const destinationAddress: ShippingAddress = {
      name: customerData.name.trim(),
      street: customerData.shipping_street.trim(),
      city: customerData.commune.trim(),
      phone: customerData.phone.trim(),
    };
    
    const defaultPickupAddress: ShippingAddress = {
      name: 'Tienda Flapp',
      street: 'Juan de Valiente 3630',
      city: 'Vitacura',
      phone: '+56912345678',
    };
    
    const originAddress: ShippingAddress = {
      ...defaultPickupAddress,
      ...(pickupAddress || {}),
    };
    
    const items: ShippingItem[] = products.map(product => ({
      name: product.title,
      quantity: product.quantity,
      price: product.price,
      length: product.length,
      height: product.height,
      depth: product.depth,
      volume: product.length * product.depth * product.height, 
    }));
    
    return {
      originAddress,
      destinationAddress,
      items,
    };
  }
  
  adaptCartToShippingRequest(cart: { 
    products: ProductWithRealStock[], 
    customer_data: CustomerDataDto 
  }): ShippingRequest {
    return this.adaptToShippingRequest(cart.customer_data, cart.products);
  }
}