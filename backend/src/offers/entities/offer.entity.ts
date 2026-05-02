import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity('offers')
export class Offer extends BaseEntity {
  @Column({
    type: 'numeric',
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount: number;

  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Wish, (item) => item.offers, {
    onDelete: 'CASCADE',
  })
  item: Wish;
}
