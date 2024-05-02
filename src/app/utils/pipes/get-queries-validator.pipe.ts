import {
  IsOptional,
  IsInt,
  Min,
  IsJSON,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { FilterParams } from '../commons/build-where';

class DateRangeDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  until?: string;
}

class SearchParamsDto {
  @IsOptional()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsString()
  value?: string;
}

class OrderParamsDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}

class ExactMatchDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class QueryParamsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value) ?? null)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value) ?? null)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsJSON()
  filters?: FilterParams;

  @IsOptional()
  @ValidateNested()
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @Type(() => DateRangeDto)
  dateRange?: DateRangeDto;

  @IsOptional()
  @ValidateNested()
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @Type(() => SearchParamsDto)
  search?: SearchParamsDto;

  @IsOptional()
  @ValidateNested()
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @Type(() => ExactMatchDto)
  exactMatch?: ExactMatchDto;

  @IsOptional()
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  @ValidateNested()
  @Type(() => OrderParamsDto)
  order?: OrderParamsDto;
}
