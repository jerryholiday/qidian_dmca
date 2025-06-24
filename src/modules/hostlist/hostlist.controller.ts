import { Body, Controller, Post } from '@nestjs/common';
import { HostlistService } from './hostlist.service';
import { ApiTags } from '@nestjs/swagger';
import { CheckIsPiratedDto } from './dto/index.dto';

@ApiTags('dmca/hostlist')
@Controller('dmca/hostlist')
export class HostlistController {
  constructor(private readonly hostlistService: HostlistService) {}

  @Post('checkIsPirated')
  checkIsPirated(@Body() body: CheckIsPiratedDto) {
    const { url, title, bookName, cbid } = body;
    return this.hostlistService.checkIsPirated(url, title, bookName, cbid);
  }

  @Post('test')
  test() {
    return this.hostlistService.checkPiratedURLList(
      '30464307003329507',
      '捞尸人',
      [
        {
          title: '捞尸人 (纯洁滴小龙)章节列表_捞尸人在线阅读-都市小说',
          href: 'https://wenku.read.qq.com/chapter/1051637401?source=m_jump',
          hostname: 'wenku.read.qq.com',
        },
        {
          title: '捞尸人-纯洁滴小龙小说-最新章节无错精校版-得奇小说网',
          href: 'https://www.deqixs.com/xiaoshuo/336/',
          hostname: 'www.deqixs.com',
        },
      ],
    );
  }
}
