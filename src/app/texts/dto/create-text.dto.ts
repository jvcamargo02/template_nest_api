import { OmitType } from '@nestjs/swagger';
import { Text } from '../entities/text.entity';

export class CreateTextDto extends OmitType(Text, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const) {}
