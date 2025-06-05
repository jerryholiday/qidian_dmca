import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DmcaController } from './dmca.controller';
import { DmcaService } from './dmca.service';
import { BookRepoService } from './repo/book.repo.service';

@Module({
  imports: [HttpModule],
  controllers: [DmcaController],
  providers: [BookRepoService, DmcaService],
  exports: [],
})
export class DmcaModule {}
