import { Body, Controller, Get, Post } from '@nestjs/common';
import { BingDMCAService } from './bingdmca.service';
import { SubmitBookHrefsDto } from './dto/index.dto';

@Controller('bing')
export class BingDMCAController {
  constructor(private readonly bingdmcaService: BingDMCAService) {}

  @Get('/account')
  getAccount() {
    return this.bingdmcaService.getAccount();
  }

  @Post('/submit_book_hrefs')
  submitBookHrefs(@Body() body: SubmitBookHrefsDto) {
    const { cbid, title, hrefs } = body;
    return this.bingdmcaService.submitBookHref(cbid, title, hrefs);
  }
}
