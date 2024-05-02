import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import {
  Allow,
  IsNotEmpty,
  IsNumberString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';

interface ILenght {
  min: number;
  max: number;
}

export function CommonNumber({
  fieldName,
  description,
  example,
  length,
  nullable = false,
}: {
  fieldName: string;
  description: string;
  example: string;
  length?: ILenght;
  nullable?: boolean;
}) {
  return applyDecorators(
    ApiProperty({
      example,
      description,
      type: 'string',
      required: !nullable,
    }),
    IsNotEmpty({
      message: `${fieldName} é obrigatório`,
    }),
    IsNumberString(
      {},
      {
        message: `O ${fieldName} deve ser um número`,
      },
    ),
    Transform(({ value }) => {
      if (value === null || value === undefined || value === '') {
        return null;
      }

      return value?.replace(/\D/g, '');
    }),
    length
      ? Length(length.min, length.max, {
          message: `O ${fieldName} deve ter entre ${length.min} e ${length.max} caracteres`,
        })
      : Allow(),
    ValidateIf((o) =>
      nullable
        ? o[fieldName] !== null &&
          o[fieldName] !== undefined &&
          o[fieldName] !== ''
        : true,
    ),
    Column({
      type: 'varchar',
      length: 20,
      nullable,
    }),
  );
}
