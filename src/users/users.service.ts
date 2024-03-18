import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = this.userRepository.create({
        ...userData,
        password: password && bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(newUser);
      delete newUser.password;

      return {
        ...newUser,
      };
    } catch (error) {
      console.log(error);
      this.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['tickets', 'tickets.lottery'],
    });
    if (!user) {
      return `User with id ${id} not found`;
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    await this.userRepository.remove(user);

    return { message: `User with id ${id} deleted successfully` };
  }

  private handleDBErrors(error: any): never {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);

    throw new InternalServerErrorException('please check server logs');
  }
}
