import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lottery } from './entities/lottery.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { format } from 'date-fns';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/tickets.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(Lottery)
    private readonly lotteryRepository: Repository<Lottery>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLotteryDto: CreateLotteryDto) {
    try {
      const { ...lotteryData } = createLotteryDto;

      const newLottery = this.lotteryRepository.create({
        ...lotteryData,
      });

      await this.lotteryRepository.save(newLottery);

      return {
        ...newLottery,
      };
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const lotteries = await this.lotteryRepository.find({
      take: limit,
      skip: offset,
      relations: ['tickets', 'tickets.user'],
    });

    const formattedLotteries = lotteries.map((lottery) => ({
      ...lottery,
      date: format(lottery.date, "yyyy-MM-dd'T'HH:mm:ssxxx"),
    }));

    return formattedLotteries;
  }

  async findOne(id: string) {
    const lottery = await this.lotteryRepository.findOne({
      where: {
        id,
      },
      relations: ['tickets', 'tickets.user'],
    });

    if (!lottery) {
      return `Lottery with id ${id} not found`;
    }
    const formattedDate = format(lottery.date, "yyyy-MM-dd'T'HH:mm:ssxxx");

    return { ...lottery, date: formattedDate };
  }

  async update(id: string, updateLotteryDto: UpdateLotteryDto) {
    const lottery = await this.lotteryRepository.findOneBy({ id });

    if (!lottery) {
      throw new Error(`Lottery with ID ${id} not found`);
    }

    Object.assign(lottery, updateLotteryDto);

    await this.lotteryRepository.save(lottery);

    return lottery;
  }

  async remove(id: string) {
    const lottery = await this.lotteryRepository.findOneBy({ id });
    await this.lotteryRepository.remove(lottery);

    return {
      message: `Lottery with id ${id} deleted successfully`,
    };
  }

  //* Tickets
  async createTicket(createTicketDto: CreateTicketDto) {
    const { lotteryId, userId } = createTicketDto;

    const lottery = await this.lotteryRepository.findOneBy({ id: lotteryId });
    if (!lottery) {
      throw new Error(`Lottery with id ${lotteryId} not found`);
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    const ticket = new Ticket();
    ticket.lottery = lottery;
    ticket.user = user;

    return this.ticketRepository.save(ticket);
  }

  private handleDBErrors(error: any): never {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);

    throw new InternalServerErrorException('please check server logs');
  }
}
