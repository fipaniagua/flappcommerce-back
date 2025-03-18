import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { HttpModule } from '@nestjs/axios';
import { DummyJsonService } from './services/dummy-json.service';
import { ShippingRateService } from './services/ShippingRate.service';
import { ShippingRequestAdapter } from './adapters/tariff.adapter';
import { UderTariffProvider } from './services/uder.service';
import { TraeloYaTariffProvider } from './services/traeloYa.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
  }), ConfigModule.forRoot({
    isGlobal: true, 
  }),], 
  controllers: [CartController],
  providers: [
    CartService, 
    DummyJsonService,
    ShippingRateService,
    ShippingRequestAdapter,
    TraeloYaTariffProvider,
    UderTariffProvider
  ],
  exports: [CartService],
})
export class CartModule {}
