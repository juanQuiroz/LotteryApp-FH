import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLotteryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString({ each: true })
  @IsOptional()
  imageUrl: string;
}
