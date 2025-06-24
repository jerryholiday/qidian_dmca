import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckIsPiratedDto {
  @ApiProperty({
    required: true,
    default:
      'https://www.books.com.tw/products/0011022040?srsltid=AfmBOopbKPxMR-0VjbPjMIf9KsNjpMHf0x-zO6HYX498PssGFVgPV1MH',
  })
  @IsString()
  url: string;

  @ApiProperty({
    required: true,
    default: '博客來-沒錢修什麼仙02',
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    default: '没钱修什么仙',
  })
  @IsString()
  bookName: string;

  @ApiProperty({
    required: true,
    default: '30947308603255608',
  })
  @IsString()
  cbid: string;
}
