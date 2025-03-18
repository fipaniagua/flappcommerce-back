import { Type } from 'class-transformer';
import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, MinLength, Min, IsPositive, ArrayNotEmpty } from 'class-validator';

export class ProductItemDto {
  @IsString()
  @MinLength(1)
  productId: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(1)
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;
}

export class CustomerDataDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  shipping_street: string;

  @IsString()
  @MinLength(2)
  commune: string;

  @IsString()
  phone: string;
}

export class CreateCartDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  products: ProductItemDto[];

  @ValidateNested()
  @Type(() => CustomerDataDto)
  customer_data: CustomerDataDto;
}