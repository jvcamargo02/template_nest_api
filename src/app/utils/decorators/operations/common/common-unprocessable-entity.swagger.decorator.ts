import { applyDecorators } from '@nestjs/common';
import { ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { ErrorMessages } from '@errors/index';

export function CommonUnprocessableEntity() {
  return applyDecorators(
    ApiUnprocessableEntityResponse({
      description: ErrorMessages.UNPROCESSABLE_ENTITY,
    }),
  );
}
