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

  @IsArray()
  @ArrayMinSize(1, { message: 'hrefs 数组不能为空' })
  @IsString({ each: true, message: '每个元素必须是字符串' })
  hrefs: string[];
}
