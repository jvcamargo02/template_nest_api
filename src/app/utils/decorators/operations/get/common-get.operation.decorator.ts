import { Get, Type, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { ApiListQuery } from './common-list-queries.operation.decorator';
import { Allow } from 'class-validator';

export function CommonGetOperation<T>({
  model,
  route,
  tags,
  authenticated = true,
}: {
  model: Type<T>;
  route: string;
  tags: string[];
  authenticated?: boolean;
}) {
  return applyDecorators(
    Get(route),
    ApiTags(...tags),
    authenticated ? ApiBearerAuth() : Allow(),
    ApiOkResponse({
      description: `Retorna o ${model.name} solicitado`,
      status: 200,
      type: model,
    }),
    ApiOperation({
      summary: `Retorna o ${model.name} solicitado`,
      description: `Retorna o ${model.name} solicitado`,
    }),
    ApiListQuery(),
    CommonErrors(),
    authenticated ? CommonUnauthorized() : Allow(),
  );
}
