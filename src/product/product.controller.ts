import { Controller, Get, Param, Post, UseGuards, Body, UseInterceptors, UploadedFile, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../utilities/user.decorator';
import { User as UserDocument } from '../shared/user.entity';
import { ProductCreateDTO, ProductUpdateDTO } from './dto/product.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
  ) {}

  @Get()
  async index(): Promise<any> {
    const products = await this.productService.findAll();
    return { products }
  }

  @Get(':id')
  async show(@Param('id') id: number): Promise<any> {
    const product = await this.productService.findOne(id);
    return { product }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body(new ValidationPipe()) dto: ProductCreateDTO,
    @User() user: UserDocument,
    @UploadedFile() file: any,
  ): Promise<any> {
    return await this.productService.create(dto, user, file);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) dto: ProductUpdateDTO,
    @User() user: UserDocument,
    @UploadedFile() file: any,
  ): Promise<any> {
    return await this.productService.update(dto, id ,user, file)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async destroy(
    @Param('id') id: number,
    @User() user: UserDocument,
  ): Promise<any> {
    return await this.productService.destroy(id, user);
  }
}
