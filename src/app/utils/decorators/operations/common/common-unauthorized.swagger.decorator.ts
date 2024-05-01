import { ErrorMessages } from '@errors/index';
import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

export function CommonUnauthorized() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: ErrorMessages.UNAUTHORIZED,
    }),
  );
}
