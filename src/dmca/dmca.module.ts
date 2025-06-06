import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DmcaController } from './dmca.controller';
import { DmcaService } from './dmca.service';
import { BookRepoService } from './repo/book.repo.service';
import { GeneralQueryRepoService } from './repo/generalQuery.repo.service';
import { DomainlistRepoService } from './repo/domainlist.repo.service';
import { DMCAListRepoService } from './repo/dmcalist.repo.service';

@Module({
  imports: [HttpModule],
  controllers: [DmcaController],
  providers: [
    BookRepoService,
    GeneralQueryRepoService,
    DomainlistRepoService,
    DMCAListRepoService,
    DmcaService,
  ],
  exports: [],
})
export class DmcaModule {}
