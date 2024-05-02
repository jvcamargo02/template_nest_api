import { applyDecorators, Get, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { CommonNotFound } from '../common/common-not-found.swagger.decorator';
import { Allow } from 'class-validator';

export function CommonDetailsOperation<T>({
  model,
  route,
  tags,
  authenticated = true,
}: {
  model: Type<T>;
  route: string;
  tags: string[];
  authenticated?: boolean;
  params?: string;
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
    CommonErrors(),
    authenticated ? CommonUnauthorized() : Allow(),
    CommonNotFound(),
  );
}
