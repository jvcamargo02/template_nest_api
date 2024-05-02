import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { dataSourceOption } from './database/index';
import { TextsModule } from '@app/texts/texts.module';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOption), TextsModule],
  controllers: [AppController],
})
export class AppModule {}
