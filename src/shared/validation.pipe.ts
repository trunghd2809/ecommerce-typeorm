import { Injectable, PipeTransform, HttpException, HttpStatus, ArgumentMetadata } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      throw new HttpException(
        { 
          message:  JSON.stringify(this.buildError(errors)),
        }, HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private buildError(errors: any): any {
    const result = {};
    errors.forEach(el => {
      const prop = el.property;
      Object.entries(el.constraints).forEach(constraint => {
        result[prop + ' ' +constraint[0]] = `${constraint[1]}`;
      });
    });
    return result;
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}