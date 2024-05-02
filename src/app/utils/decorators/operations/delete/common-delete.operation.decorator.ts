import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Delete, Type, applyDecorators } from '@nestjs/common';

import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonNotFound } from '../common/common-not-found.swagger.decorator';
import { Allow } from 'class-validator';

export function CommonDeleteOperation<T>({
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
    Delete(route),
    ApiTags(...tags),
    authenticated ? ApiBearerAuth() : Allow(),
    ApiOkResponse({
      description: `Deleta o ${model.name} solicitado`,
      status: 200,
      type: model,
    }),
    ApiOperation({
      summary: `Deleta o ${model.name} solicitado`,
      description: `Deleta o ${model.name} solicitado`,
    }),
    CommonErrors(),
    authenticated ? CommonUnauthorized() : Allow(),
    CommonNotFound(),
  );
}
