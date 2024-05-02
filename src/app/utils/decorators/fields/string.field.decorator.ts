import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import {
  Allow,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Column } from 'typeorm';

interface ILenght {
  min: number;
  max: number;
}

export function CommonString({
  fieldName,
  description,
  example,
  length = null,
  nullable,
  url,
}: {
  fieldName: string;
  description: string;
  example: string;
  length?: ILenght | null;
  nullable?: boolean;
  url?: boolean;
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
      message: `O ${fieldName} é obrigatório`,
    }),
    IsString({
      message: `O ${fieldName} deve ser uma string`,
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
    url
      ? IsUrl(
          {},
          {
            message: `${fieldName} deve ser uma URL`,
          },
        )
      : Allow(),
    Column({
      type: length ? 'varchar' : 'text',
      ...(length ? { length: length.max } : {}),
      nullable,
    }),
  );
}
