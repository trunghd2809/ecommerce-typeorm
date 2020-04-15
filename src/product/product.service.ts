import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product as ProductEntity } from './product.entity';
import { Repository, DeleteResult } from 'typeorm';
import { ProductCreateDTO, ProductUpdateDTO } from './dto/product.dto';
import { User } from '../shared/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productEntity: Repository<ProductEntity>
  ) {}
  
  async findAll(): Promise<ProductEntity[]> {
    try {
      const product = await this.productEntity.find();
      return product;
    } catch (error) {
      throw new HttpException('Errors processing', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<ProductEntity> {
    return await this.productEntity.findOne(id);
  }

  async create(productDTO: ProductCreateDTO, user: User, file?: any): Promise<ProductEntity> {
    try {
      const newProduct = this.productEntity.create(productDTO);
      newProduct.user = user;
      if (file && file.originalname) newProduct.image = file.originalname;
      const product = await this.productEntity.save(newProduct);
      return product;
    } catch (error) {
      throw new HttpException('Errors processing', HttpStatus.BAD_REQUEST);
    }
  }

  async update(updateDTO: ProductUpdateDTO, id: number, user: User, file?: any): Promise<ProductEntity> {
      const product = await this.productEntity.findOne(id, { relations: ['user'] });
      if (!product) throw new HttpException('Not Found product', HttpStatus.NOT_FOUND);
      if (product.user && product.user.id !== user.id) {
        throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
      }
      const updated = Object.assign({}, product, updateDTO);
      if (file && file.originalname) updated.image = file.originalname;
      return await this.productEntity.save(updated);
  }

  async destroy(id: number, user: User): Promise<DeleteResult> {
    const product = await this.productEntity.findOne(id, { relations: ['user'] });
    if (!product) throw new HttpException('Not Found product', HttpStatus.NOT_FOUND);
    if (!product.user || (product.user.id !== user.id)) {
      throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
    }
    try {
      return await this.productEntity.delete(id);
    } catch (error) {
      throw new HttpException('Errors processing', HttpStatus.BAD_REQUEST);
    }
  }
}
