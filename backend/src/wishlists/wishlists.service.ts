import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { errorText } from '../consts';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wishlist } from './entities/wishlists.entity';
import { CreateWishlistDto, UpdateWishlistDto } from './dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}
  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      relations: ['owner', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(errorText.wishlist.notFound);
    }

    return wishlist;
  }

  async create(dto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const items = await this.wishesService.findMany(dto.itemsId);

    const { name, image } = dto;

    const wishlist = this.wishlistRepository.create({
      name,
      image,
      owner: user,
      items,
    });

    return this.wishlistRepository.save(wishlist);
  }

  async update(
    id: number,
    dto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(errorText.wishlist.notOwnerToUpdate);
    }

    if (dto.itemsId) {
      wishlist.items = await this.wishesService.findMany(dto.itemsId);
    }

    Object.assign(wishlist, dto);

    return this.wishlistRepository.save(wishlist);
  }

  async removeOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(errorText.wishlist.notOwnerToRemove);
    }

    await this.wishlistRepository.remove(wishlist);

    return wishlist;
  }
}
