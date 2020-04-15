import { Type } from 'class-transformer';
import {  IsString, IsNumber } from 'class-validator';

export class ProductCreateDTO {
  @IsString()
  title: string;
  @IsString()
  descriptions: string;
  @IsNumber()
  @Type(() => Number)
  price: number;
}

export type ProductUpdateDTO = Partial<ProductCreateDTO>; 