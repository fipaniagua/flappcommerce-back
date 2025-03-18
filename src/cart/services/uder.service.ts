import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { TariffProvider, ShippingRequest, ShippingRateResult } from "../interfaces/tariffProvider.interface";
import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import * as https from 'https';


@Injectable()
export class UderTariffProvider implements TariffProvider {
  private readonly baseUrl = 'https://recruitment.weflapp.com/tarifier/uder';
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getName(): string {
    return 'Uder';
  }

  async getRate(request: ShippingRequest): Promise<ShippingRateResult> {
    try {
      const uderRequest = this.mapToUderRequest(request);
      
      const { data } = await firstValueFrom(
        this.httpService.post(this.baseUrl, uderRequest, {
          headers: {
            'X-Api-Key': this.configService.get<string>('UDER_API_KEY'),
          },
          httpsAgent: new https.Agent({  
            rejectUnauthorized: false
          })
        })
      );

      if (data.error) {
        return {
          provider: this.getName(),
          success: false,
          error: data.error,
          price: Infinity,
        };
      }

      return {
        provider: this.getName(),
        success: true,
        price: data.fee,
      };
    } catch (error) {
      return {
        provider: this.getName(),
        success: false,
        error: error.response?.data?.error || 'Error al obtener tarifa de Uder',
        price: Infinity,
      };
    }
  }

  private mapToUderRequest(request: ShippingRequest): any {
    const manifestItems = request.items.map(item => ({
      name: item.name || 'Producto',
      quantity: item.quantity,
      price: item.price,
      dimensions: {
        length: item.length || 1,
        height: item.height || 1,
        depth: item.depth || 1,
      }
    }));

    return {
      pickup_address: request.originAddress.street,
      pickup_name: request.originAddress.name,
      pickup_phone_number: request.originAddress.phone,
      dropoff_address: request.destinationAddress.street,
      dropoff_name: request.destinationAddress.name,
      dropoff_phone_number: request.destinationAddress.phone,
      manifest_items: manifestItems,
    };
  }
}