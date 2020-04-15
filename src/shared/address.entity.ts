import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;
  @Column()
  addr1: string;
  @Column({ nullable: true })
  addr2: string;
  @Column({ nullable: true })
  city: string;
  @Column({ nullable: true })
  state: string;
  @Column({ nullable: true })
  zip: number;
  @OneToOne( type => User, user => user.address )
  @JoinColumn()
  user: User;
}