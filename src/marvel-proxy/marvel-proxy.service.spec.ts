import { Test, TestingModule } from '@nestjs/testing';
import { MarvelProxyService } from './marvel-proxy.service';

describe('MarvelProxyService', () => {
  let service: MarvelProxyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarvelProxyService],
    }).compile();

    service = module.get<MarvelProxyService>(MarvelProxyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
