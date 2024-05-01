import { applyDecorators, Get, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { CommonNotFound } from '../common/common-not-found.swagger.decorator';

export function CommonDetailsOperation<T>({
  model,
  route,
  tags,
  authenticated = true,
  params = 'ID',
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
    authenticated ? ApiBearerAuth() : null,
    ApiParam({
      name: params,
      description: `ID do ${model.name}`,
      type: 'string',
    }),
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
    authenticated ? CommonUnauthorized() : null,
    CommonNotFound(),
  );
}
