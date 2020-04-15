import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User as UserEntity } from './user.entity';
import { User } from '../auth/interface/user.interface';
import { CreateDTO, LoginDTO } from 'src/auth/dto/user.dto';
import { Payload } from 'src/auth/dto/payload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  private sanitizeUser(user: UserEntity): User {
    const { address } = user;
    const obj = {
      id: user.id,
      username: user.username,
      seller: user.seller,
      address: {
        addr1: address && address.addr1,
        addr2: address && address.addr2,
        city: address && address.city,
        state: address && address.state,
        zip: address && address.zip,
      },
    }
    return obj;
  }

  async create(userDTO: CreateDTO): Promise<User> {
    const { username } =  userDTO;
    const user = await this.userRepository.findOne({ username });
    if (user) {
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }
    const newUser = this.userRepository.create(userDTO);
    let obj: any;
    try {
      obj = await this.userRepository.save(newUser);
      return this.sanitizeUser(obj);
    } catch (error) {
      Logger.log('Create user error', error);
      throw new HttpException('Create user fail!', HttpStatus.BAD_REQUEST);
    }
  }

  async login(userDTO: LoginDTO): Promise<User> {
    const { username, password } = userDTO;
    const user = await this.userRepository.findOne({ username }, { relations: ['address'] });
    if (!user) {
      throw new HttpException('Username invalid!', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('Password invalid!', HttpStatus.BAD_REQUEST);
    }
  }

  async findByPayload(payload: Payload): Promise<User> {
    const { id } = payload;
    try {
      const user = await this.userRepository.findOne(id, { relations: ['address'] });
      if (!user) {
        throw new HttpException('User not exists', HttpStatus.BAD_REQUEST);
      }
      return this.sanitizeUser(user);
    } catch (error) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
