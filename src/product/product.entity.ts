import { PrimaryGeneratedColumn, Entity, ManyToOne, Column } from 'typeorm';
import { User } from 'src/shared/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @ManyToOne(() => User, user => user.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User
  @Column({ nullable: false })
  title: string;
  @Column({ type: 'text' })
  descriptions: string;
  @Column({ nullable: false })
  price: number;
  @Column({ nullable: true })
  image: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
}