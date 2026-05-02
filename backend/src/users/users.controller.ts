import {
  Controller,
  UseGuards,
  Param,
  Get,
  Post,
  Patch,
  Body,
  Req,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import {
  UpdateUserDto,
  UserWishesDto,
  FindUsersDto,
  UserProfileResponseDto,
  UserPublicProfileResponseDto,
} from './dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findOwn(@Req() req: RequestWithUser): Promise<UserProfileResponseDto> {
    const { user } = req;
    return this.usersService.findOne(user.id);
  }

  @Patch('me')
  update(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const { user } = req;
    return this.usersService.update(user.id, dto);
  }

  @Get('me/wishes')
  findOwnWishes(@Req() req: RequestWithUser): Promise<UserWishesDto[]> {
    const { user } = req;
    return this.usersService.findOwnWishes(user.id);
  }

  @Get(':username')
  findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  findWishes(@Param('username') username: string): Promise<UserWishesDto[]> {
    return this.usersService.findWishesByUsername(username);
  }

  @Post('find')
  findMany(@Body() dto: FindUsersDto): Promise<UserProfileResponseDto[]> {
    return this.usersService.findMany(dto.query);
  }
}
