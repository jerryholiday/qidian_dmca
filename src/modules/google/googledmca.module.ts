import { Module } from '@nestjs/common';
import { BookModule } from '../book/book.module';
import { HostlistModule } from '../hostlist/hostlist.module';
import { GoogleDMCAController } from './googledmca.controller';
import { GoogleAccountRepoService } from './repo/googleaccount.repo.service';
import { GoogleDMCALinkRepoService } from './repo/googledmcalink.repo.service';
import { GoogleDMCAListRepoService } from './repo/googledmcalist.repo.service';
import { GoogleDMCAService } from './googledmca.service';

@Module({
  imports: [BookModule, HostlistModule],
  controllers: [GoogleDMCAController],
  providers: [
    GoogleAccountRepoService,
    GoogleDMCALinkRepoService,
    GoogleDMCAListRepoService,
    GoogleDMCAService,
  ],
  exports: [],
})
export class GoogleDMCAModule {}
