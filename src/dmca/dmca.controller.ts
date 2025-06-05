import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DmcaService } from './dmca.service';
import { QueryBooksDto, SubmitBookHrefsDto } from './dto/index.dto';

@Controller('dmca')
export class DmcaController {
  constructor(private readonly dmcaService: DmcaService) {}

  @Get('/books')
  queryBooks(@Query() query: QueryBooksDto) {
    const { cbid, title, pageNum = 1, pageSize = 10 } = query;
    return this.dmcaService.queryBooks(pageNum, pageSize, cbid, title);
  }

  @Post('/submitBookHrefs')
  submitBookHrefs(@Body() body: SubmitBookHrefsDto) {
    const { cbid, hrefs } = body;
    return this.dmcaService.submitBookHref(cbid, hrefs);
  }
}
