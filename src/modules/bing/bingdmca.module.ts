import { Module } from '@nestjs/common';
import { BingDMCAController } from './bingdmca.controller';
import { BingDMCAService } from './bingdmca.service';
import { BingAccountRepoService } from './repo/bingaccount.repo.service';
import { BingDMCALinkRepoService } from './repo/bingdmcalink.repo.service';
import { BingDMCAListRepoService } from './repo/bingdmcalist.repo.service';
import { BookModule } from '../book/book.module';
import { HostlistModule } from '../hostlist/hostlist.module';

@Module({
  imports: [BookModule, HostlistModule],
  controllers: [BingDMCAController],
  providers: [
    BingAccountRepoService,
    BingDMCALinkRepoService,
    BingDMCAListRepoService,
    BingDMCAService,
  ],
  exports: [],
})
export class BingDMCAModule {}
