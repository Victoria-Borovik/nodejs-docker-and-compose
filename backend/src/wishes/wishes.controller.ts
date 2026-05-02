import {
  Controller,
  ParseIntPipe,
  UseGuards,
  Req,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';
import { WishDto, CreateWishDto, UpdateWishDto } from './dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}
  @Post()
  @UseGuards(JwtGuard)
  create(@Req() req: RequestWithUser, @Body() dto: CreateWishDto) {
    const { user } = req;
    return this.wishesService.create(user, dto);
  }

  @Get('last')
  findLast(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: number): Promise<WishDto> {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWishDto,
  ) {
    const { user } = req;
    return this.wishesService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  removeOne(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<WishDto> {
    const { user } = req;
    return this.wishesService.removeOne(id, user.id);
  }

  @Post(':id/copy')
  @UseGuards(JwtGuard)
  copyOne(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    const { user } = req;
    return this.wishesService.copyOne(id, user);
  }
}
