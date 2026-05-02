import {
  IsOptional,
  IsNotEmpty,
  IsString,
  Length,
  IsUrl,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @Length(1, 64)
  username: string;

  @IsOptional()
  @Length(1, 200)
  about?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
