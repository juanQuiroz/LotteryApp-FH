import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'fa834a19-e64b-4ad6-88f4-5f6b075d446c' })
  @IsUUID()
  lotteryId: string;

  @ApiProperty({ example: '9e58e875-02db-4b3b-9273-60b9e9f1a5c2' })
  @IsUUID()
  userId: string;
}
