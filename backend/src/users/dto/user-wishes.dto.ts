import { OmitType } from '@nestjs/mapped-types';
import { WishDto } from '../../wishes/dto/wish.dto';

export class UserWishesDto extends OmitType(WishDto, ['owner']) {}
