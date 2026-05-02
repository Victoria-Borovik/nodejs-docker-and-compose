import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { errorText } from '../../consts';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = this.authService.validatePassword(username, password);

    if (!user) {
      throw new UnauthorizedException(errorText.auth.unauthorized);
    }

    return user;
  }
}
