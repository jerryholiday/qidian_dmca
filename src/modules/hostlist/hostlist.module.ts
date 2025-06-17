import { Module } from '@nestjs/common';
import { HostlistController } from './hostlist.controller';
import { HostlistService } from './hostlist.service';
import { HostlistRepoService } from './repo/hostlist.repo.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [HostlistController],
  providers: [HostlistRepoService, HostlistService],
  exports: [HostlistService],
})
export class HostlistModule {}
