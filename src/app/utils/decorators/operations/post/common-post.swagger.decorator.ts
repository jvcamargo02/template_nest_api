import { Post, Type, applyDecorators } from '@nestjs/common';
import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import { CommonUnprocessableEntity } from '../common/common-unprocessable-entity.swagger.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

export function CommonPostOperation<T>({
  model,
  route,
  tags,
  dto,
  authenticated = true,
}: {
  model: Type<T>;
  route: string;
  tags: string[];
  dto: Type<T>;
  authenticated?: boolean;
}) {
  return applyDecorators(
    Post(route),
    ApiTags(...tags),
    authenticated ? ApiBearerAuth() : null,
    ApiCreatedResponse({
      description: `Cria um novo ${model.name}`,
      type: model,
    }),
    ApiOperation({
      summary: `Cria um novo ${model.name}`,
      description: `Cria um novo ${model.name}`,
    }),
    ApiBody({ type: dto }),
    CommonErrors(),
    authenticated ? CommonUnauthorized() : null,
    CommonUnprocessableEntity(),
  );
}
