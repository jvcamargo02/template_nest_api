import { Type, applyDecorators } from '@nestjs/common';

import { CommonPostOperation } from './post/common-post.operation.decorator';
import { CommonEditOperation } from './edit/common-edit.operation.decorator';
import { CommonDeleteOperation } from './delete/common-delete.operation.decorator';
import { CommonGetOperation } from './get/common-get.operation.decorator';
import { CommonDetailsOperation } from './details/common-details.operation.decorator';

export function CreateOperation<T>({
  model,
  route,
  tags,
  dto,
  authenticated = true,
}: {
  model: Type<T>;
  route: string;
  tags: string[];
  dto: Type<any>;
  authenticated?: boolean;
}) {
  return applyDecorators(
    CommonPostOperation({
      model,
      route,
      tags,
      dto,
      authenticated,
    }),
  );
}

export function UpdateOperation<T>({
  model,
  route,
  tags,
  dto,
  authenticated = true,
}: {
  model: Type<T>;
  route: string;
  tags: string[];
  dto: Type<any>;
  authenticated?: boolean;
}) {
  return applyDecorators(
    CommonEditOperation({
      model,
      route,
      tags,
      dto,
      authenticated,
    }),
  );
}

export function RemoveOperation<T>({
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
    CommonDeleteOperation({
      model,
      route,
      tags,
      authenticated,
    }),
  );
}

export function FindAllOperation<T>({
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
    CommonGetOperation({
      model,
      route,
      tags,
      authenticated,
    }),
  );
}

export function FindOneOperation<T>({
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
    CommonDetailsOperation({
      model,
      route,
      tags,
      authenticated,
    }),
  );
}
