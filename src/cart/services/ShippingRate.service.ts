import { Injectable } from "@nestjs/common";
import { ShippingRequest, ShippingRateResult } from "../interfaces/tariffProvider.interface";
import { UderTariffProvider } from "./uder.service";
import { TraeloYaTariffProvider } from "./traeloYa.service";

@Injectable()
export class ShippingRateService {
  constructor(
    private readonly uderTariffProvider: UderTariffProvider,
    private readonly traeloYaTariffProvider: TraeloYaTariffProvider
  ) {}

  async getBestRate(request: ShippingRequest): Promise<ShippingRateResult> {
    const providers = [this.traeloYaTariffProvider, this.uderTariffProvider]
    
    const ratePromises = providers.map(provider => 
      provider.getRate(request)
        .catch(error => ({
          provider: provider.getName(),
          success: false,
          error: error.message || 'Error desconocido',
          price: Infinity
        }))
    );
    
    const results = await Promise.all(ratePromises);
    // console.log("tariff:")
    // console.log(results)
    
    const successfulResults = results.filter(result => result.success);
    
    if (successfulResults.length === 0) {
      return {
        provider: 'Multiple',
        success: false,
        error: 'No se encontraron tarifas disponibles en ningún proveedor',
        price: Infinity
      };
    }
    
    const bestRate = successfulResults.reduce((lowest, current) => 
      (current.price < lowest.price) ? current : lowest
    );
    
    return bestRate;
  }
}