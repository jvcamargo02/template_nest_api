import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, ValidateIf } from 'class-validator';
import { Column } from 'typeorm';

export function CommonDecimal({
  fieldName,
  description,
  example,
  nullable = false,
}: {
  fieldName: string;
  description: string;
  example: string;
  nullable?: boolean;
}) {
  return applyDecorators(
    ApiProperty({
      example,
      description,
      type: 'string',
      required: !nullable,
    }),
    Transform(({ value }) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }

      return Number(value)?.toFixed(2);
    }),
    IsNotEmpty({
      message: `${fieldName} é obrigatório`,
    }),
    IsDecimal(
      {
        decimal_digits: '0,2',
      },
      {
        message: `${fieldName} deve ser um número decimal`,
      },
    ),
    ValidateIf((o) =>
      nullable
        ? o[fieldName] !== null &&
          o[fieldName] !== undefined &&
          o[fieldName] !== ''
        : true,
    ),
    Column({
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable,
      transformer: {
        to: (value) => (nullable && (!value || value === '') ? value : value),
        from: (value) => value,
      },
    }),
  );
}
