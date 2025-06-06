import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DmcaService } from './dmca.service';
import {
  QueryBooksDto,
  QueryGeneralQueriesDto,
  SubmitBookHrefsDto,
} from './dto/index.dto';

@Controller('dmca')
export class DmcaController {
  constructor(private readonly dmcaService: DmcaService) {}

  @Get('/books')
  queryBooks(@Query() query: QueryBooksDto) {
    const { cbid, title, pageNum = 1, pageSize = 10 } = query;
    return this.dmcaService.queryBooks(pageNum, pageSize, cbid, title);
  }

  @Get('/general_queries')
  queryGeneralQueries(@Query() query: QueryGeneralQueriesDto) {
    const { pageNum = 1, pageSize = 10 } = query;
    return this.dmcaService.queryGeneralQueries(pageNum, pageSize);
  }

  @Post('/submitBookHrefs')
  submitBookHrefs(@Body() body: SubmitBookHrefsDto) {
    const { cbid, title, hrefs } = body;
    return this.dmcaService.submitBookHref(cbid, title, hrefs);
  }
}
