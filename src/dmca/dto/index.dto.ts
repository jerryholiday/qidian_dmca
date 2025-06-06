import {
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HrefObj } from 'src/interfaces';

export class QueryBooksDto {
  @IsOptional()
  @IsString()
  cbid?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}

export class SubmitBookHrefsDto {
  @IsString()
  cbid: string;

  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'hrefs 数组不能为空' })
  hrefs: HrefObj[];
}

export class QueryGeneralQueriesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}
