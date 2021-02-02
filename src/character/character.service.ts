import { Model, Query } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { MarvelProxyService } from 'src/marvel-proxy/marvel-proxy.service';
import { InjectModel } from '@nestjs/mongoose';
import { Cache, CacheDocument } from './schemas/cache.schema';

@Injectable()
export class CharacterService {
  constructor(
    private readonly marvelProxyService: MarvelProxyService,
    @InjectModel(Cache.name) private cacheModel: Model<CacheDocument>,
  ) {}
  async getCharactersIds(): Promise<number[]> {
    const { shouldRenewCache, cache } = await this.checkCacheUpToDate();
    if (shouldRenewCache || !cache) {
      return this.updateCache(cache);
    }
    return cache.ids;
  }
  async checkCacheUpToDate(): Promise<{
    shouldRenewCache: boolean;
    cache?: CacheDocument;
  }> {
    const cacheRenewThreshold = 1000 * 60 * 60 * 24;
    const cache = await this.cacheModel.findOne();
    if (!cache) {
      return {
        shouldRenewCache: true,
      };
    }
    const isOutdated =
      Date.now() - cache.refreshedAt.getTime() >= cacheRenewThreshold;
    if (!isOutdated) {
      return { shouldRenewCache: false, cache };
    }
    const totalCharacters = await this.marvelProxyService.fetchTotalNumberOfCharacters();
    const shouldRenewCache = cache.total != totalCharacters;
    if (!shouldRenewCache) {
      await this.updateCacheRefreshedAt(cache);
    }
    return {
      shouldRenewCache,
      cache,
    };
  }
  async updateCache(cache?: CacheDocument): Promise<number[]> {
    const characters = await this.marvelProxyService.fetchAllCharacters();
    const ids = characters.map((ch) => ch.id);
    const currentDate = new Date();
    await this.cacheModel.findOneAndUpdate(
      { _id: cache?._id },
      {
        $set: { total: characters.length, ids, refreshedAt: currentDate },
        $setOnInsert: {
          createdAt: currentDate,
        },
      },
      {
        upsert: true,
        useFindAndModify: false,
      },
    );
    return ids;
  }
  async updateCacheRefreshedAt(cache: CacheDocument) {
    await this.cacheModel.findOneAndUpdate(
      { _id: cache._id },
      { $set: { refreshedAt: new Date() } },
      { useFindAndModify: false },
    );
  }
  async getCharacterInfo(paramId: string) {
    const {
      id,
      name,
      description,
    } = await this.marvelProxyService.getCharacterInfo(paramId);
    return { id, name, description };
  }
}
