import { Module } from '@nestjs/common';
import { BingDMCAController } from './bingdmca.controller';
import { BingDMCAService } from './bingdmca.service';

@Module({
  imports: [],
  controllers: [BingDMCAController],
  providers: [BingDMCAService],
  exports: [],
})
export class BingDMCAModule {}
