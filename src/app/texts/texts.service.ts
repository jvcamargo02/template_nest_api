import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { handleErrors } from '@decorators/errors/error.handler.decorator';
import { QueryParamsDto } from '@pipes/get-queries-validator.pipe';
import {
  applyPaginationAndOrder,
  buildWhereClause,
} from '@commons/build-where';
import { ErrorMessages } from '@errors/index';

import { Text } from './entities/text.entity';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';

@Injectable()
export class TextsService {
  constructor(
    @InjectRepository(Text)
    private repository: Repository<Text>,
  ) {}

  async create(createTextDto: CreateTextDto) {
    try {
      const data = await this.repository.save(createTextDto);

      return {
        message: 'Texts criado com sucesso!',
        data,
      };
    } catch (error) {
      handleErrors(error);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    filters,
    dateRange,
    search,
    exactMatch,
  }: QueryParamsDto) {
    try {
      const whereClause = buildWhereClause({
        filters,
        dateRange,
        search,
        exactMatch,
      });

      const queryBuild = this.repository
        .createQueryBuilder('texts')
        .where(whereClause)
        .andWhere('texts.deleted_at IS NULL');

      const queryWithPagination = applyPaginationAndOrder(
        queryBuild,
        page,
        limit,
      );

      const [results, total] = await queryWithPagination.getManyAndCount();

      return {
        message: 'Registros encontrados com sucesso!',
        data: results,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
        },
      };
    } catch (error) {
      handleErrors(error);
    }
  }

  async findActives({
    page = 1,
    limit = 10,
    filters,
    dateRange,
    search,
    exactMatch,
  }: QueryParamsDto) {
    try {
      const whereClause = buildWhereClause({
        filters,
        dateRange,
        search,
        exactMatch,
      });

      const queryBuild = this.repository
        .createQueryBuilder('texts')
        .where(whereClause);

      const queryWithPagination = applyPaginationAndOrder(
        queryBuild,
        page,
        limit,
      );

      const [results, total] = await queryWithPagination.getManyAndCount();

      return {
        message: 'Registros encontrados com sucesso!',
        data: results,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
        },
      };
    } catch (error) {
      handleErrors(error);
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.repository.findOne({
        where: { id },
      });

      if (!data) {
        throw new HttpException(
          ErrorMessages.COMMON_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: 'Registro encontrado com sucesso!',
        data,
      };
    } catch (error) {
      handleErrors(error);
    }
  }

  async update(id: number, updateTextDto: UpdateTextDto) {
    try {
      const data = await this.repository.findOne({
        where: { id },
      });

      if (!data) {
        throw new HttpException(
          ErrorMessages.COMMON_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedDate = await this.repository.save({
        ...data,
        ...updateTextDto,
      });

      return {
        message: 'Texts atualizado com sucesso!',
        data: updatedDate,
      };
    } catch (error) {
      handleErrors(error);
    }
  }

  async remove(id: number) {
    try {
      const data = await this.repository.findOne({
        where: { id },
      });

      if (!data) {
        throw new HttpException(
          ErrorMessages.COMMON_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const deleted = await this.repository.softDelete(id);

      if (!deleted) {
        throw new HttpException(
          ErrorMessages.COMMON_DELETE_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        message: 'Texts removido com sucesso!',
        data: deleted,
      };
    } catch (error) {
      handleErrors(error);
    }
  }
}
