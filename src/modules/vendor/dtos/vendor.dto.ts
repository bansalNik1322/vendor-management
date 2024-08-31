import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateVendorDTO {
  @IsOptional()
  email: string;

  @IsOptional()
  name: string;
}

export class CreateVendorDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  address: string;
}
