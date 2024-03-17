import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lottery } from './lottery.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => Lottery, (lottery) => lottery.tickets)
  lottery: Lottery;
}
