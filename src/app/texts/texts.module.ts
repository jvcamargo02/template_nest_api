import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TextsService } from './texts.service';
import { Text } from './entities/text.entity';
import { TextsController } from './texts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Text])],
  controllers: [TextsController],
  providers: [TextsService],
})
export class TextsModule {}
