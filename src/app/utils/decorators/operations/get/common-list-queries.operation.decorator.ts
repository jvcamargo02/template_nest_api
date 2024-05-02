import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiListQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número da página para paginação',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Quantidade de itens por página',
    }),
    ApiQuery({
      name: 'filters',
      required: false,
      type: String,
      description: 'Filtros em formato JSON, ex: [{"category.id": "1"}]',
    }),
    ApiQuery({
      name: 'dateRange',
      required: false,
      type: String,
      description:
        'Faixa de datas em formato JSON, ex: {"from": "2023-01-01", "until": "2023-01-31", "field": "created_at"}',
    }),
    ApiQuery({
      name: 'exactMatch',
      required: false,
      type: String,
      description:
        'Busca exata em formato JSON, ex: {"field": "name", "value": "some text"}',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description:
        'Busca elástica em formato JSON, ex: {"fields": ["name", "description"], "value": "some text"}',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      type: String,
      description:
        'Ordenação em formato JSON, ex: {"field": "name", "order": "ASC"}',
    }),
  );
}
