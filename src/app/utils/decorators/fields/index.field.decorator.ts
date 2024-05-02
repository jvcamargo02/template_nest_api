import { Type } from '@nestjs/common';

import { CommonDateField } from './date.field.decorator';
import { CommonDecimal } from './decimal.field.decorator';
import { CommonEnum } from './enum.field.decorator';
import { CommonString } from './string.field.decorator';
import { CommonNumber } from './number.field.decorator';

interface ILenght {
  min: number;
  max: number;
}

export function CommonField({
  fieldName,
  description,
  example,
  type,
  required,
  length,
  url,
  enumType,
}: {
  fieldName: string;
  description: string;
  example: string;
  type: 'DATE' | 'DECIMAL' | 'ENUM' | 'TEXT' | 'INT' | 'VARCHAR';
  required: boolean;
  length?: ILenght | null;
  url?: boolean;
  enumType?: Type<any>;
}) {
  switch (type) {
    case 'DATE':
      return CommonDateField({
        fieldName,
        description,
        example,
        nullable: !required,
      });
    case 'DECIMAL':
      return CommonDecimal({
        fieldName,
        description,
        example,
        nullable: !required,
      });
    case 'ENUM':
      if (!enumType) {
        throw new Error('EnumType is required');
      }

      return CommonEnum({
        fieldName,
        description,
        example,
        enumType,
      });
    case 'TEXT':
      return CommonString({
        fieldName,
        description,
        example,
        length,
        nullable: !required,
        url,
      });
    case 'INT':
      return CommonNumber({
        fieldName,
        description,
        example,
        length,
        nullable: !required,
      });
    case 'VARCHAR':
      return CommonString({
        fieldName,
        description,
        example,
        length,
        nullable: !required,
        url,
      });
    default:
      return null;
  }
}
