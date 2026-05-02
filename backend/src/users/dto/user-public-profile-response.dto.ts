import { OmitType } from '@nestjs/mapped-types';
import { UserProfileResponseDto } from './user-profile-response.dto';

export class UserPublicProfileResponseDto extends OmitType(
  UserProfileResponseDto,
  ['email'],
) {}
