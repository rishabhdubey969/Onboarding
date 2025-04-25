import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength
} from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    readonly email: string;
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string;

}
