import { HttpModule, Module } from '@nestjs/common';
import { MarvelProxyService } from './marvel-proxy.service';

@Module({
  imports: [HttpModule],
  providers: [MarvelProxyService],
  exports: [MarvelProxyService],
})
export class MarvelProxyModule {}
