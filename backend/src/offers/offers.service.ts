import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { errorText } from '../consts';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User): Promise<Offer> {
    const wish = await this.wishesService.findOne(dto.itemId);

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(errorText.offer.ownWish);
    }

    if (dto.amount + wish.raised > wish.price) {
      throw new ForbiddenException(errorText.offer.exceedPrice);
    }

    const offer = this.offerRepository.create({
      amount: dto.amount,
      hidden: dto.hidden ?? false,
      user,
      item: wish,
    });

    wish.raised += dto.amount;
    await this.offerRepository.save(offer);
    await this.wishesService.updateRaised(wish);

    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer) {
      throw new NotFoundException(errorText.offer.notFound);
    }

    return offer;
  }
}
