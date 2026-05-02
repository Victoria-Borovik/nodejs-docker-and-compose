import { IsString, IsArray, IsNumber, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(0, 250)
  name: string;

  @IsString()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
