import { Delete, Type, applyDecorators } from '@nestjs/common';
import { CommonErrors } from '../common/common-errors.swagger.decorator';
import { CommonNotFound } from '../common/common-not-found.swagger.decorator';
import { CommonUnauthorized } from '../common/common-unauthorized.swagger.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

export function CommontDeleteOperation<T>({
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
    authenticated ? ApiBearerAuth() : null,
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
    authenticated ? CommonUnauthorized() : null,
    CommonNotFound(),
  );
}
