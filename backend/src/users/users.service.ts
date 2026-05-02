import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import type { Repository } from 'typeorm';
import { errorText } from '../consts';
import { WishesService } from '../wishes/wishes.service';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UserWishesDto,
  UserProfileResponseDto,
  UserPublicProfileResponseDto,
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private wishesService: WishesService,
    private hashService: HashService,
  ) {}
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(errorText.user.notFound);
    }

    return user;
  }

  async findEntityByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(errorText.user.notFound);
    }

    return user;
  }

  async findByUsername(
    username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.findEntityByUsername(username);

    const {
      id,
      username: userUsername,
      about,
      avatar,
      createdAt,
      updatedAt,
    } = user;

    return {
      id,
      username: userUsername,
      about,
      avatar,
      createdAt,
      updatedAt,
    };
  }

  findOwnWishes(id: number): Promise<UserWishesDto[]> {
    return this.wishesService.findUserWishes(id);
  }

  async findWishesByUsername(username: string): Promise<UserWishesDto[]> {
    const user = await this.findEntityByUsername(username);

    return await this.wishesService.findUserWishes(user.id);
  }

  async findMany(query: string): Promise<UserProfileResponseDto[]> {
    return this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
      order: { id: 'ASC' },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { username, email, password, ...rest } = dto;

    const existingEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new BadRequestException(errorText.user.emailAlreadyInUse);
    }

    const existingUsername = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new BadRequestException(errorText.user.usernameAlreadyInUse);
    }

    const hashedPassword = await this.hashService.hash(password);
    const user = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      ...rest,
    });

    return this.usersRepository.save(user);
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(errorText.user.notFound);
    }

    if (dto.password) {
      dto.password = await this.hashService.hash(dto.password);
    }

    if (dto.email) {
      const existingEmail = await this.usersRepository.findOne({
        where: { email: dto.email },
      });

      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException(errorText.user.emailAlreadyInUse);
      }
    }

    if (dto.username) {
      const existingUsername = await this.usersRepository.findOne({
        where: { username: dto.username },
      });

      if (existingUsername && existingUsername.id !== id) {
        throw new BadRequestException(errorText.user.usernameAlreadyInUse);
      }
    }

    const updatedUser = { ...user, ...dto };

    const updated = await this.usersRepository.save(updatedUser);
    const {
      id: userId,
      username,
      about,
      avatar,
      email,
      createdAt,
      updatedAt,
    } = updated;

    return {
      id: userId,
      username,
      about,
      avatar,
      email,
      createdAt,
      updatedAt,
    };
  }
}
