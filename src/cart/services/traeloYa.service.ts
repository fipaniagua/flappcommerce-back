import { ShippingRateResult, ShippingRequest, TariffProvider } from "../interfaces/tariffProvider.interface";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from "rxjs";
import * as https from 'https';


@Injectable()
export class TraeloYaTariffProvider implements TariffProvider {
  private readonly baseUrl = 'https://recruitment.weflapp.com/tarifier/traelo_ya';
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getName(): string {
    return 'TraeloYa';
  }

  async getRate(request: ShippingRequest): Promise<ShippingRateResult> {
    try {
      const traeloYaRequest = this.mapToTraeloYaRequest(request);
      
      const { data } = await firstValueFrom(
        this.httpService.post(this.baseUrl, traeloYaRequest, {
          headers: {
            'X-Api-Key': this.configService.get<string>('TRAELO_YA_API_KEY'),
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
        price: data.deliveryOffers.pricing.total,
      };
    } catch (error) {
      console.log(error)
      return {
        provider: this.getName(),
        success: false,
        error: error.response?.data?.error || 'Error al obtener tarifa de TraeloYa',
        price: Infinity,
      };
    }
  }

  private mapToTraeloYaRequest(request: ShippingRequest): any {

    const items = request.items.map(item => ({
      quantity: item.quantity,
      value: item.price,
      volume: item.volume || (item.length && item.height && item.depth 
                ? item.length * item.height * item.depth 
                : 0)
    }));

    const waypoints = [
      {
        type: 'PICK_UP',
        addressStreet: request.originAddress.street,
        city: request.originAddress.city,
        phone: request.originAddress.phone,
        name: request.originAddress.name,
      },
      {
        type: 'DROP_OFF',
        addressStreet: request.destinationAddress.street,
        city: request.destinationAddress.city,
        phone: request.destinationAddress.phone,
        name: request.destinationAddress.name,
      }
    ];

    return {
      items,
      waypoints,
    };
  }
}