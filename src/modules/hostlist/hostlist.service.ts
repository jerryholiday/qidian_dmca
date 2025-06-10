import { Injectable } from '@nestjs/common';
import { HostlistRepoService } from './repo/hostlist.repo.service';

@Injectable()
export class HostlistService {
  constructor(public readonly hostlistRepo: HostlistRepoService) {}
}
