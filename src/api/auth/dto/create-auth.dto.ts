import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsInt,
  IsBoolean,
  IsArray,
} from 'class-validator';
export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
  @IsNotEmpty()
  @IsInt()
  readonly role: number;
  @IsNotEmpty()
  @IsBoolean()
  readonly isActive: boolean;
  @IsArray()
  @IsInt({ each: true }) // Validate each element in the array is an integer
  @IsNotEmpty()
  leaves: number[];
}
