import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ErrorMessages } from '@errors/index';

export function CommonUnauthorized() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: ErrorMessages.UNAUTHORIZED,
    }),
  );
}
