import { ErrorMessages } from '@errors/index';
import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

export function CommonNotFound() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: ErrorMessages.COMMON_NOT_FOUND,
    }),
  );
}
