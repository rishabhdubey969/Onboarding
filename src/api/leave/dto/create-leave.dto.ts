import { IsDateString, IsEnum, IsInt, Length, IsNotEmpty, IsString } from 'class-validator';

export class CreateLeaveDto {
    @IsNotEmpty()
    @IsEnum(['planned', 'emergency'])
    readonly leave_type: string;

    @IsNotEmpty()
    @IsInt()
    readonly leave_id: number;

    @IsNotEmpty()
    @IsString()
    readonly user_id: string;

    @IsNotEmpty()
    @IsDateString()
    readonly leave_date: string;

    // @IsNotEmpty()
    // @IsDateString()
    // readonly end_date: Date;

    @IsNotEmpty()
    @IsString()
    readonly remark: string;

    @IsNotEmpty()
    @Length(10, 500)
    readonly reason: string;
}
