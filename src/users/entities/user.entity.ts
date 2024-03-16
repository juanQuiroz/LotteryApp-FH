import { Lottery } from 'src/lottery/entities/lottery.entity';
import { Ticket } from 'src/lottery/entities/tickets.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullname: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false, nullable: true })
  password?: string;

  @Column('text', { nullable: true })
  discordId?: string;

  @Column('bool', { default: true })
  isActive: boolean;

  // Relación con las loterías creadas por el usuario
  @OneToMany(() => Lottery, (lottery) => lottery.creator)
  createdLotteries: Lottery[];

  // Relación con los tickets asociados al usuario
  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
