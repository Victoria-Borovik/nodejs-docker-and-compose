import { BaseDto } from '../../common/dto/base.dto';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { WishPartialDto } from '../../wishes/dto/wish-partial.dto';

export class WishlistDto extends BaseDto {
  name: string;
  image: string;
  owner: UserPublicProfileResponseDto;
  items: WishPartialDto[];
}
