export interface ShippingAddress {
    street: string;
    city: string;
    name: string;
    phone: string;
}
  
export interface ShippingItem {
    name?: string;
    quantity: number;
    price: number;
    length?: number;
    height?: number;
    depth?: number;
    volume?: number;
}

export interface ShippingRequest {
    originAddress: ShippingAddress;
    destinationAddress: ShippingAddress;
    items: ShippingItem[];
  }
  
export interface ShippingRateResult {
    provider: string;
    success: boolean;
    price: number;
    error?: string;
}

export interface TariffProvider {
    getName(): string;
    getRate(request: ShippingRequest): Promise<ShippingRateResult>;
  }
  
  