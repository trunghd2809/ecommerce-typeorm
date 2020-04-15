import { registerDecorator, ValidationOptions, ValidationArguments, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function IsNonPrimitiveArray(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsNonPrimitiveArray',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Array.isArray(value) && value.reduce((a, b) => a && typeof b === 'object' && !Array.isArray(b), true);
        },
      },
    });
  };
}

export function IsArrayOfInstancesOf(className, validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {}
  }

  if (!validationOptions.message) {
    validationOptions.message = "Value must be an array of valid(s) " + className.name;
  }

  return function (object: Object, propertyName: string) {
    registerDecorator({
        name: "IsArrayOfInstancesOf",
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        async: true,
        validator: {
          async validate(value: any, args: ValidationArguments): Promise<boolean> {
            if (! Array.isArray(value)) {
              return false;
            }
            const items = value;
            async function validateItem(item): Promise<boolean> {
              const object = plainToClass(className, item);
              const errors = await validate(object);
              return !errors.length;
            }
            const validations = await Promise.all(items.map(validateItem));
            // Si y'a au moins un false, on return false
            return validations.filter(isValidated => !isValidated).length === 0;
          }
        }
    });
  }
}

export function IsObjectOfInstancesOf(className, validationOptions?: ValidationOptions) {
  if (!validationOptions) {
    validationOptions = {}
  }

  if (!validationOptions.message) {
    validationOptions.message = "Value must be an Object of valid(s) " + className.name;
  }

  return function (object: Object, propertyName: string) {
    registerDecorator({
        name: "IsObjectOfInstancesOf",
        target: object.constructor,
        propertyName: propertyName,
        constraints: [],
        options: validationOptions,
        async: true,
        validator: {
          async validate(value: any): Promise<boolean> {
            if (typeof value !== 'object') {
              return false;
            }
            const object = plainToClass(className, value);
            const errors = await validate(object);
            return errors.length === 0;
          }
        }
    });
  }
}