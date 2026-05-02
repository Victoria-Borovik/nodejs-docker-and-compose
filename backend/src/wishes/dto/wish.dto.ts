import { BaseDto } from '../../common/dto/base.dto';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { OfferDto } from '../../offers/dto/offer.dto';

export class WishDto extends BaseDto {
  name: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  copied: number;
  description: string;
  owner: UserPublicProfileResponseDto;
  offers: OfferDto[];
}
