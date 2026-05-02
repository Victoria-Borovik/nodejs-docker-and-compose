import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private hashService: HashService,
    private usersService: UsersService,
  ) {}

  async auth(user: User) {
    const payload = { sub: user.id };

    return await { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findEntityByUsername(username);
    const isPasswordMatch = await this.hashService.compare(
      password,
      user.password,
    );

    if (user && isPasswordMatch) {
      delete user.password;
      return user;
    }

    return null;
  }
}
