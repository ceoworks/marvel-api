import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { time } from 'console';

import * as crypto from 'crypto';

const apiKey = process.env.MARVEL_API_KEY;
const apiSecret = process.env.MARVEL_API_SECRET;
const marvelHost = 'https://gateway.marvel.com';

interface MarvelAPICharacter {
  id: number;
  name: string;
  description: string;
}

interface MarvelAPIResponseData<T = MarvelAPICharacter[]> {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: T;
}

interface MarvelAPIResponse<T = MarvelAPICharacter[]> {
  data: MarvelAPIResponseData<T>;
}

@Injectable()
export class MarvelProxyService {
  constructor(private httpService: HttpService) {}
  getHash(timestamp: number, publicKey: string, privateKey: string): string {
    return crypto
      .createHash('md5')
      .update(timestamp + privateKey + publicKey)
      .digest('hex');
  }
  async sendProxyRequest<T = MarvelAPIResponse>({
    route,
    offset,
    limit,
  }: {
    route: string;
    offset?: number;
    limit?: number;
  }): Promise<AxiosResponse<T>> {
    const url = marvelHost + route;
    const timestamp = Date.now();
    const query = {
      ts: timestamp,
      hash: this.getHash(timestamp, apiKey, apiSecret),
      apikey: apiKey,
      offset,
      limit,
    };
    console.log('query:', query);
    return this.httpService
      .get<T>(url, {
        params: query,
      })
      .toPromise();
  }
  async getCharacters(
    offset?: number,
    limit?: number,
  ): Promise<MarvelAPIResponseData> {
    const response = await this.sendProxyRequest<MarvelAPIResponse>({
      route: '/v1/public/characters',
      offset,
      limit,
    });
    return response.data.data;
  }
  async getCharacterInfo(id: string): Promise<MarvelAPICharacter> {
    console.time('fetch');
    const response = await this.sendProxyRequest<MarvelAPIResponse>({
      route: `/v1/public/characters/${id}`,
    });
    console.timeEnd('fetch');
    console.log('response:', response.data.data.results);
    return response.data.data.results.pop();
  }
  async fetchTotalNumberOfCharacters(): Promise<number> {
    return (await this.getCharacters(0, 1)).total;
  }
  async fetchAllCharacters(): Promise<MarvelAPICharacter[]> {
    const defaultLimit = 100;
    let offset = 0;
    let characters: MarvelAPICharacter[] = [];
    const { count, results, total } = await this.getCharacters(
      offset,
      defaultLimit,
    );
    offset = count;
    characters = characters.concat(results);
    while (offset < total) {
      const { count, results } = await this.getCharacters(offset, defaultLimit);
      offset += count;
      characters = characters.concat(results);
    }
    return characters;
  }
}
