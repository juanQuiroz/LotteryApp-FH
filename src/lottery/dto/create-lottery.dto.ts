import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateLotteryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  details: string;

  @ApiProperty({ example: '2024-07-28T18:30:00' })
  @IsDateString()
  date: string;

  @ApiProperty({
    nullable: true,
  })
  @IsString({ each: true })
  @IsOptional()
  imageUrl: string;
}
