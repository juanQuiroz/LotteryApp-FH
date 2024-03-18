import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';

@ApiTags('Lottery')
@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createLotteryDto: CreateLotteryDto) {
    return this.lotteryService.create(createLotteryDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.lotteryService.findAll(paginationDto);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.lotteryService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateLotteryDto: UpdateLotteryDto) {
    return this.lotteryService.update(id, updateLotteryDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.lotteryService.remove(id);
  }

  @Post('get-ticket')
  @HttpCode(201)
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.lotteryService.createTicket(createTicketDto);
  }
}
