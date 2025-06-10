import { Controller } from '@nestjs/common';
import { BingDMCAService } from './bingdmca.service';

@Controller('bing')
export class BingDMCAController {
  constructor(private readonly bingdmcaService: BingDMCAService) {}
}
