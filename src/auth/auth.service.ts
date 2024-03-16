import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid : EMAIL');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid: PASSWORD');
    }

    return {
      user: { ...user, password: undefined },
      token: this.getJwtToken({ id: user.id }),
      refreshToken: this.getRefreshToken({ id: user.id }),
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken);
    const userEmail = decoded['email'];
    console.log(
      '🚀 ~ AuthService ~ refreshAccessToken ~ userEmail:',
      userEmail,
    );

    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.getJwtToken({ id: userEmail });

    return {
      accessToken,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private getRefreshToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload, {
      expiresIn: '3h',
    });
    return token;
  }
}
