import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '@errors/index';

export function handleErrors(error: any, message?: string) {
  throw new HttpException(
    error.message ?? message ?? ErrorMessages.INTERNAL_SERVER_ERROR,
    error.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
