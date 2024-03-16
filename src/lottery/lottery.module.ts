import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lottery } from './entities/lottery.entity';
import { Ticket } from './entities/tickets.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [LotteryController],
  providers: [LotteryService],
  imports: [TypeOrmModule.forFeature([Lottery, Ticket]), UsersModule],
  exports: [TypeOrmModule],
})
export class LotteryModule {}
