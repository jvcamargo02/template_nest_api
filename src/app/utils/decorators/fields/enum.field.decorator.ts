import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';

export function CommonEnum({
  fieldName,
  description,
  example,
  enumType,
}: {
  fieldName: string;
  description: string;
  example: string;
  enumType: Type<any>;
}) {
  return applyDecorators(
    ApiProperty({
      description,
      enum: enumType,
      example,
      required: false,
    }),
    Transform(({ value }) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }

      return value;
    }),
    IsEnum(enumType, {
      message: `${fieldName} deve ser um dos seguintes valores: ${Object.values(enumType)}`,
    }),
    ValidateIf(
      (o) =>
        o[fieldName] !== null &&
        o[fieldName] !== undefined &&
        o[fieldName] !== '',
    ),
    Column({
      type: 'enum',
      enum: enumType,
      default: example,
    }),
  );
}
