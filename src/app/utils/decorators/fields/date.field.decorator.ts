import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsDateString, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';

export function CommonDateField({
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
      required: !nullable,
    }),
    Transform(({ value }) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }

      return value;
    }),
    IsNotEmpty({
      message: `${fieldName} é obrigatório`,
    }),
    ValidateIf((o) =>
      nullable
        ? o[fieldName] !== null &&
          o[fieldName] !== undefined &&
          o[fieldName] !== ''
        : true,
    ),
    IsDateString({}, { message: `${fieldName} deve ser uma data` }),
    Column({
      type: 'date',
      nullable,
      transformer: {
        to: (value) => (nullable && (!value || value === '') ? null : value),
        from: (value) => value,
      },
    }),
  );
}
