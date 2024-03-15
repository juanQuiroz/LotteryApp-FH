import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    default: 10,
    description: 'how many rows do you need',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Similar a enableImplicitConversions: true
  limit?: number;

  @ApiProperty({
    default: 0,
    required: false,
    description: 'how many rows do you want to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number) // Similar a enableImplicitConversions: true
  offset?: number;
}
