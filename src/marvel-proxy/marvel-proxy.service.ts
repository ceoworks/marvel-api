import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import * as crypto from 'crypto';

const apiKey = '';
const apiSecret = '';
const marvelHost = 'https://gateway.marvel.com';

interface MarvelAPICharacter {
  id: number;
  name: string;
  description: string;
}

interface MarvelAPIResponse<T = MarvelAPICharacter[]> {
  data: {
    results: T;
  };
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
  }: {
    route: string;
  }): Promise<AxiosResponse<T>> {
    const url = marvelHost + route;
    const timestamp = Date.now();
    const query = {
      ts: timestamp,
      hash: this.getHash(timestamp, apiKey, apiSecret),
      apikey: apiKey,
    };
    console.log('query:', query);
    return this.httpService
      .get<T>(url, {
        params: query,
      })
      .toPromise();
  }
  async getCharacters(): Promise<MarvelAPICharacter[]> {
    const response = await this.sendProxyRequest<MarvelAPIResponse>({
      route: '/v1/public/characters',
    });
    console.log('response:', response);
    return response.data.data.results;
  }
  async getCharacterInfo(id: string): Promise<MarvelAPICharacter> {
    const response = await this.sendProxyRequest<MarvelAPIResponse>({
      route: `/v1/public/characters/${id}`,
    });
    console.log('response:', response.data.data.results);
    return response.data.data.results.pop();
  }
}
