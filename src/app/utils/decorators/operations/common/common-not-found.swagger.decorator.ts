import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import { ErrorMessages } from '@errors/index';

export function CommonNotFound() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: ErrorMessages.COMMON_NOT_FOUND,
    }),
  );
}
