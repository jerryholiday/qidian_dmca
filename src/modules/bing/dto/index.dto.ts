import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { HrefObj } from 'src/interfaces';

export class SubmitBingBookHrefsDto {
  @ApiProperty({
    required: true,
    default: '30464307003329507',
  })
  @IsString()
  cbid: string;

  @ApiProperty({
    required: true,
    default: [
      {
        title: '捞尸人-纯洁滴小龙小说-最新章节无错精校版-得奇小说网',
        href: 'https://www.deqixs.com/xiaoshuo/336/',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'hrefs 数组不能为空' })
  hrefs: HrefObj[];
}

export class ComplaintBingCallbackDto {
  @ApiProperty({
    required: true,
    default: '2',
  })
  @IsString()
  dmcaListId: string;

  @ApiProperty({
    required: true,
    default: 'ailei@yuewen.com',
  })
  @IsString()
  operator: string;

  @ApiProperty({
    required: true,
    default: '732973283t27439',
  })
  @IsString()
  noticeId: string;
}
