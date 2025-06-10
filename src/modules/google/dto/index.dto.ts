import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { HrefObj } from 'src/interfaces';

export class SubmitBookHrefsDto {
  @IsString()
  cbid: string;

  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'hrefs 数组不能为空' })
  hrefs: HrefObj[];
}
