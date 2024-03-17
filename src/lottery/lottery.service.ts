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

@Injectable()
export class LotteryService {
  constructor(
    @InjectRepository(Lottery)
    private readonly lotteryRepository: Repository<Lottery>,
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
    });

    return lotteries;
  }

  async findOne(id: string) {
    const lottery = await this.lotteryRepository.findOneBy({ id });
    if (!lottery) {
      return `Lottery with id ${id} not found`;
    }
    return lottery;
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

  private handleDBErrors(error: any): never {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);

    throw new InternalServerErrorException('please check server logs');
  }
}
