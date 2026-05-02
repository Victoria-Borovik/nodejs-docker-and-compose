import { BaseDto } from '../../common/dto/base.dto';
import { UserDto } from '../../users/dto/user.dto';
import { WishDto } from '../../wishes/dto/wish.dto';

export class OfferDto extends BaseDto {
  item: WishDto;
  amount: number;
  hidden: boolean;
  user: UserDto;
}
