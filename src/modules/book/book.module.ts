import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookRepoService } from './repo/book.repo.service';
import { GeneralQueryRepoService } from './repo/generalQuery.repo.service';
import { BookService } from './book.service';

@Module({
  imports: [],
  controllers: [BookController],
  providers: [BookRepoService, GeneralQueryRepoService, BookService],
  exports: [BookService],
})
export class BookModule {}
