import { Controller } from '@nestjs/common';
import { HostlistService } from './hostlist.service';

@Controller('dmca/hostlist')
export class HostlistController {
  constructor(private readonly hostlistService: HostlistService) {}
}
