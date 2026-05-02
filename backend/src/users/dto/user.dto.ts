import { BaseDto } from '../../common/dto/base.dto';
import { WishDto } from '../../wishes/dto/wish.dto';
import { OfferDto } from '../../offers/dto/offer.dto';
import { WishlistDto } from '../../wishlists/dto/wishlist.dto';

export class UserDto extends BaseDto {
  username: string;
  about: string;
  avatar: string;
  email: string;
  wishes: WishDto[];
  offers: OfferDto[];
  wishlists: WishlistDto[];
}
