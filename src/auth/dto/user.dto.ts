import { IsString, IsBoolean, IsOptional, IsNumber, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { IsObjectOfInstancesOf } from 'src/shared/custom.validate';

class AddressDT0 {
  @IsString()
  @IsDefined()
  @IsOptional()
  addr1?: string;
  @IsString()
  @IsOptional()
  addr2?: string;
  @IsOptional()
  @IsString()
  city?: string;
  @IsString()
  @IsOptional()
  state?: string;
  @IsNumber()
  @IsOptional()
  zip?: number;
}

export class CreateDTO {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  seller?: boolean;
  @IsDefined()
  @IsObjectOfInstancesOf(AddressDT0)
  @Type(() => AddressDT0)
  address: AddressDT0;
}

export class LoginDTO {
  @IsString()
  username: string;
  @IsString()
  password: string;
}