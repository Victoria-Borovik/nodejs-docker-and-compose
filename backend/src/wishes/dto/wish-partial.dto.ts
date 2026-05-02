import { OmitType } from '@nestjs/mapped-types';
import { WishDto } from './wish.dto';

export class WishPartialDto extends OmitType(WishDto, ['owner', 'offers']) {}
