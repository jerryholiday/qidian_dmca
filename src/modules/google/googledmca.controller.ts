import { Body, Controller, Get, Post } from '@nestjs/common';
import { GoogleDMCAService } from './googledmca.service';
import {
  ComplaintGoogleCallbackDto,
  SubmitGoogleBookHrefsDto,
} from './dto/index.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dmca/google')
@Controller('dmca/google')
export class GoogleDMCAController {
  constructor(private readonly googleDMCAService: GoogleDMCAService) {}

  @Get('/account')
  getAccount() {
    return this.googleDMCAService.getAccount();
  }

  @Post('/submit_book_hrefs')
  submitBookHrefs(@Body() body: SubmitGoogleBookHrefsDto) {
    const { cbid, hrefs } = body;
    return this.googleDMCAService.submitBookHref(cbid, hrefs);
  }

  @Post('complaint_callback')
  complaintCallback(@Body() body: ComplaintGoogleCallbackDto) {
    const { dmcaListId, operator, noticeId } = body;
    return this.googleDMCAService.complaintCallback(
      dmcaListId,
      operator,
      noticeId,
    );
  }
}
