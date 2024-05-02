import { Body, Controller, Param, Query } from '@nestjs/common';

import {
  CreateOperation,
  FindAllOperation,
  FindOneOperation,
  RemoveOperation,
  UpdateOperation,
} from '@operations/index.operation.decorator';
import { handleErrors } from '@decorators/errors/error.handler.decorator';
import { QueryParamsDto } from '@pipes/get-queries-validator.pipe';

import { TextsService } from './texts.service';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { Text } from './entities/text.entity';

@Controller()
export class TextsController {
  constructor(private readonly textsService: TextsService) {}

  @CreateOperation({
    model: Text,
    route: '/texts',
    tags: ['texts'],
    dto: CreateTextDto,
    authenticated: false,
  })
  async create(@Body() createTextDto: CreateTextDto) {
    try {
      return await this.textsService.create(createTextDto);
    } catch (error) {
      handleErrors(error);
    }
  }

  @FindAllOperation({
    model: Text,
    route: '/texts',
    tags: ['texts'],
    authenticated: false,
  })
  async findAll(@Query() queryParams: QueryParamsDto) {
    try {
      return await this.textsService.findAll(queryParams);
    } catch (error) {
      handleErrors(error);
    }
  }

  @FindOneOperation({
    model: Text,
    route: '/texts/:id',
    tags: ['texts'],
    authenticated: false,
  })
  async findOne(@Param('id') id: number) {
    try {
      return await this.textsService.findOne(id);
    } catch (error) {
      handleErrors(error);
    }
  }

  @UpdateOperation({
    model: Text,
    route: '/texts/:id',
    tags: ['texts'],
    dto: UpdateTextDto,
    authenticated: false,
  })
  async update(@Param('id') id: number, @Body() updateTextDto: UpdateTextDto) {
    try {
      return await this.textsService.update(id, updateTextDto);
    } catch (error) {
      handleErrors(error);
    }
  }

  @RemoveOperation({
    model: Text,
    route: '/texts/:id',
    tags: ['texts'],
    authenticated: false,
  })
  async remove(@Param('id') id: number) {
    try {
      return await this.textsService.remove(id);
    } catch (error) {
      handleErrors(error);
    }
  }
}
