import { Body, Controller, Get, Post } from '@nestjs/common';
import { GoogleDMCAService } from './googledmca.service';
import { SubmitBookHrefsDto } from './dto/index.dto';

@Controller('dmca/google')
export class GoogleDMCAController {
  constructor(private readonly googleDMCAService: GoogleDMCAService) {}

  @Get('/account')
  getAccount() {
    return this.googleDMCAService.getAccount();
  }

  @Post('/submit_book_hrefs')
  submitBookHrefs(@Body() body: SubmitBookHrefsDto) {
    const { cbid, title, hrefs } = body;
    return this.googleDMCAService.submitBookHref(cbid, title, hrefs);
  }
}
