import { Get, Type, applyDecorators } from '@nestjs/common';
import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { ApiListQuery } from './common-list-queries.swagger.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
    authenticated ? ApiBearerAuth() : null,
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
    authenticated ? CommonUnauthorized() : null,
  );
}
