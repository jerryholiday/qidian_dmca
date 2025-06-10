import { Controller, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { QueryBooksDto, QueryGeneralQueriesDto } from './dto/index.dto';

@Controller('dmca')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/books')
  queryBooks(@Query() query: QueryBooksDto) {
    const { cbid, title, pageNum = 1, pageSize = 10 } = query;
    return this.bookService.queryBooks(pageNum, pageSize, cbid, title);
  }

  @Get('/general_queries')
  queryGeneralQueries(@Query() query: QueryGeneralQueriesDto) {
    const { pageNum = 1, pageSize = 10 } = query;
    return this.bookService.queryGeneralQueries(pageNum, pageSize);
  }
}
