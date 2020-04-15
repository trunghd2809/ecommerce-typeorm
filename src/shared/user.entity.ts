import { Entity, Column, PrimaryGeneratedColumn, OneToOne, BeforeInsert, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Address } from './address.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column({ default: false })
  seller: boolean;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;
  @OneToOne(() => Address, address => address.user, {
    cascade: true,
  })
  address: Address;
  @OneToMany(() => Product, product => product.user)
  products: Product[]

  @BeforeInsert()
  private async bcryptPassword() {
    this.password = await bcrypt.hash(this['password'], 10);;
  }
}