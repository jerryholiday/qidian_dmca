import { Body, Controller, Get, Post } from '@nestjs/common';
import { BingDMCAService } from './bingdmca.service';
import {
  ComplaintBingCallbackDto,
  SubmitBingBookHrefsDto,
} from './dto/index.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dmca/bing')
@Controller('dmca/bing')
export class BingDMCAController {
  constructor(private readonly bingdmcaService: BingDMCAService) {}

  @Get('/account')
  getAccount() {
    return this.bingdmcaService.getAccount();
  }

  @Post('/submit_book_hrefs')
  submitBookHrefs(@Body() body: SubmitBingBookHrefsDto) {
    const { cbid, hrefs } = body;
    return this.bingdmcaService.submitBookHref(cbid, hrefs);
  }

  @Post('complaint_callback')
  complaintCallback(@Body() body: ComplaintBingCallbackDto) {
    const { dmcaListId, operator, noticeId } = body;
    return this.bingdmcaService.complaintCallback(
      dmcaListId,
      operator,
      noticeId,
    );
  }
}
