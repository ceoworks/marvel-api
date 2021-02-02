## Installation

```bash
$ yarn install
```

## Running the app

```bash
#
$ MARVEL_API_KEY={insert marvel api key here} MARVEL_API_SECRET={insert marvel api secret key here} yarn run start

# watch mode
$ MARVEL_API_KEY={insert marvel api key here} MARVEL_API_SECRET={insert marvel api secret key here} yarn run start:dev

# production mode
$ MARVEL_API_KEY={insert marvel api key here} MARVEL_API_SECRET={insert marvel api secret key here} yarn run start:prod
```

## Docs

Swagger docs are available @ http://localhost:8080/docs

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Caching Strategy

I decided to implement caching strategy base on the following two factors:

1. If we have cache, which is no longer than `CacheThreshold` (e.g. 24h) - API would return cached ids
2. If our cache is older than `CacheThreshold`, we should check for `totalCharacters` in Marvel Api
3. If `totalCharacters` number equals `total` in our cache - we return cached result and renew `cache.refreshedAt`
4. Otherwise, we fetch all characters once again from Marvel API and update our cache.
