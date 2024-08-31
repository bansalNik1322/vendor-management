import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  @MaxLength(20)
  password: string;

  @IsString()
  @IsOptional()
  address: string;
}
