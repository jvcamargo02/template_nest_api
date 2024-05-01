import { Patch, Put, Type, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonNotFound } from '../common/common-not-found.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { CommonUnprocessableEntity } from '../common/common-unprocessable-entity.swagger.decorator';

export function CommonEditOperation<T>({
  model,
  route,
  tags,
  dto,
  authenticated = true,
  isPatch = true,
}: {
  model: Type<T>;
  route: string;
  tags: string[];
  dto: Type<T>;
  authenticated?: boolean;
  isPatch?: boolean;
}) {
  return applyDecorators(
    isPatch ? Patch(route) : Put(route),
    ApiTags(...tags),
    ApiBody({ type: dto }),
    authenticated ? ApiBearerAuth() : null,
    ApiOkResponse({
      description: `Atualiza o ${model.name} solicitado`,
      status: 200,
      type: model,
    }),
    ApiOperation({
      summary: `Atualiza o ${model.name} solicitado`,
      description: `Atualiza o ${model.name} solicitado`,
    }),
    CommonErrors(),
    authenticated ? CommonUnauthorized() : null,
    CommonNotFound(),
    CommonUnprocessableEntity(),
  );
}
