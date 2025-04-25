import { IsOptional, IsEnum, IsString } from 'class-validator';

export class FilterLeaveDto {
  @IsOptional()
  @IsEnum(['planned', 'emergency'])
  leave_type?: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}