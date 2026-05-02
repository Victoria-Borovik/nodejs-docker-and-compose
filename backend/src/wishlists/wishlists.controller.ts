import {
  Controller,
  UseGuards,
  ParseIntPipe,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlists.entity';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Post()
  create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const { user } = req;
    return this.wishlistsService.create(dto, user);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateWishlistDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Wishlist> {
    const { user } = req;
    return this.wishlistsService.update(id, dto, user);
  }

  @Delete(':id')
  removeOne(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Wishlist> {
    const { user } = req;
    return this.wishlistsService.removeOne(id, user);
  }
}
