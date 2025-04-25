import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  readonly first_name: string;
  @IsNotEmpty()
  @IsString()
  readonly last_name: string;
  @IsNotEmpty()
  @MinLength(10)
  @MinLength(10)
  readonly phone: string;
  @IsNotEmpty()
  @IsString()
  readonly gender: string;
  @IsNotEmpty()
  @IsDate()
  readonly date_of_birth: Date;
  @IsNotEmpty()
  @IsString()
  readonly city: string;
  @IsNotEmpty()
  @IsString()
  readonly address: string;
  @IsNotEmpty()
  @IsString()
  readonly material_status: string;
  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}
