import {
  ParseIntPipe,
  Controller,
  UseGuards,
  Param,
  Get,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Req() req: RequestWithUser, @Body() dto: CreateOfferDto) {
    const { user } = req;
    return await this.offersService.create(dto, user);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
