import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import type { Repository } from 'typeorm';
import { UserDto } from '../users/dto/user.dto';
import { Wish } from './entities/wish.entity';
import { UserWishesDto } from '../users/dto';
import { CreateWishDto, UpdateWishDto } from './dto';
import { LAST_WISH_COUNT, TOP_WISH_COUNT, errorText } from '../consts';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async findUserWishes(userId: number): Promise<UserWishesDto[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id: userId } },
      select: { owner: false },
      order: { id: 'ASC' },
    });

    return wishes;
  }

  async create(owner: UserDto, dto: CreateWishDto): Promise<Wish> {
    return this.wishRepository.save({
      ...dto,
      owner,
      raised: 0,
      copied: 0,
    });
  }

  async findLast(): Promise<Wish[]> {
    return await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: LAST_WISH_COUNT,
      relations: ['owner', 'offers'],
    });
  }

  async findTop(): Promise<Wish[]> {
    return await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: TOP_WISH_COUNT,
      relations: ['owner', 'offers'],
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new NotFoundException(errorText.wish.notFound);
    }

    return wish;
  }

  async update(id: number, dto: UpdateWishDto, user: UserDto) {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException(errorText.wish.notOwnerToUpdate);
    }

    if (dto.price && wish.raised > 0) {
      throw new ForbiddenException(errorText.wish.alreadyRaised);
    }

    return await this.wishRepository.save({ ...wish, ...dto });
  }

  async removeOne(id: number, userId: number): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(errorText.wish.notOwnerToRemove);
    }

    return this.wishRepository.remove(wish);
  }

  async copyOne(id: number, owner: UserDto): Promise<Wish> {
    const sourceWish = await this.findOne(id);

    const alreadyCopied = await this.wishRepository.findOne({
      where: {
        link: sourceWish.link,
        owner: { id: owner.id },
      },
    });

    if (alreadyCopied) {
      throw new ForbiddenException(errorText.wish.alreadyCopied);
    }

    sourceWish.copied += 1;
    this.wishRepository.save(sourceWish);

    const { name, link, image, price, description } = sourceWish;

    const createdWish = await this.create(owner, {
      name,
      link,
      image,
      price,
      description,
    });

    return createdWish;
  }

  async updateRaised(wish: Wish) {
    await this.wishRepository.save(wish);
  }

  async findMany(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { id: In(ids) },
    });

    if (wishes.length !== ids.length) {
      throw new NotFoundException(errorText.wish.notFound);
    }

    return wishes;
  }
}
