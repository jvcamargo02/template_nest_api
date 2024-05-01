import { ErrorMessages } from '@errors/index';
import { applyDecorators } from '@nestjs/common';
import { ApiUnprocessableEntityResponse } from '@nestjs/swagger';

export function CommonUnprocessableEntity() {
  return applyDecorators(
    ApiUnprocessableEntityResponse({
      description: ErrorMessages.UNPROCESSABLE_ENTITY,
    }),
  );
}
