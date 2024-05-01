import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorMessages } from '../../error-messages';

export function CommonErrors() {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: ErrorMessages.INTERNAL_SERVER_ERROR,
    }),
    ApiBadRequestResponse({ description: ErrorMessages.INVALID_REQUEST }),
  );
}
