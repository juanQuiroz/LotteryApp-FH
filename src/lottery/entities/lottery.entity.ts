import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from './tickets.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Lottery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  details: string;

  @Column({ type: 'date' })
  date: Date;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  winners: string[];

  @Column('text')
  imageUrl: string;

  // Relación con el usuario creador
  @ManyToOne(() => User)
  creator: User;

  // Relación con los tickets asociados a la lotería
  @OneToMany(() => Ticket, (ticket) => ticket.lottery)
  tickets: Ticket[];
}
