import { Entity } from 'typeorm';

import { CommonField } from '@decorators/fields/index.field.decorator';
import { BaseEntity } from '@entities/base.entity';

@Entity({
  name: 'texts',
})
export class Text extends BaseEntity {
  @CommonField({
    fieldName: 'name',
    description: 'NOME DO TEXTO',
    example: 'string',
    type: 'VARCHAR',
    required: true,
    length: { min: 0, max: 255 },
  })
  name: string;

  @CommonField({
    fieldName: 'url',
    description: 'URL DO PDF',
    example: 'string',
    type: 'TEXT',
    required: false,
    url: true,
  })
  url: string;

  @CommonField({
    fieldName: 'text',
    description: 'TEXTO EM MARKDOWN',
    example: 'string',
    type: 'TEXT',
    required: true,
  })
  text: string;

  @CommonField({
    fieldName: 'number',
    description: 'NUMERO DO TEXTO',
    example: '1',
    type: 'INT',
    required: false,
    length: null,
    url: false,
    enumType: null,
  })
  number: number;

  @CommonField({
    fieldName: 'date',
    description: 'DATA DE CRIAÇÂO',
    example: '2021-01-01',
    type: 'DATE',
    required: false,
    length: null,
    url: false,
    enumType: null,
  })
  date: Date;

  @CommonField({
    fieldName: 'value',
    description: 'VALOR DO TEXTO',
    example: '1.5',
    type: 'DECIMAL',
    required: false,
    length: null,
    url: false,
    enumType: null,
  })
  value: number;
}
