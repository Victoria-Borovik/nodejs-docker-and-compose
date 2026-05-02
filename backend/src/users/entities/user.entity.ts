import { Entity, Column, OneToMany } from 'typeorm';
import {
  Length,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { BaseEntity } from '../../common/entity/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlists.entity';
import { DEFAULT_ABOUT, DEFAULT_AVATAR } from '../../consts';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Length(1, 64)
  username: string;

  @Column({ default: DEFAULT_ABOUT })
  @IsOptional()
  @Length(1, 200)
  about: string;

  @Column({ default: DEFAULT_AVATAR })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
