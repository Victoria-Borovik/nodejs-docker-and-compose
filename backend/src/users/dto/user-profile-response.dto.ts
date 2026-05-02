import { OmitType } from '@nestjs/mapped-types';
import { UserDto } from './user.dto';

export class UserProfileResponseDto extends OmitType(UserDto, [
  'wishes',
  'offers',
  'wishlists',
]) {}
