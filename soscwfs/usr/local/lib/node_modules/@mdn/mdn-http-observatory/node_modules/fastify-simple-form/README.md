# fastify-simple-form

[![Build Status](https://travis-ci.org/unematiii/fastify-simple-form.svg)](https://travis-ci.org/unematiii/fastify-simple-form)
[![Coverage Status](https://coveralls.io/repos/github/unematiii/fastify-simple-form/badge.svg)](https://coveralls.io/github/unematiii/fastify-simple-form)
[![View on npm](https://img.shields.io/npm/v/fastify-simple-form)](https://www.npmjs.com/package/fastify-simple-form)
[![View on npm](https://img.shields.io/npm/dw/fastify-simple-form)](https://www.npmjs.com/package/fastify-simple-form)
[![GitHub license](https://img.shields.io/github/license/unematiii/fastify-simple-form)](https://github.com/unematiii/fastify-simple-form/blob/main/LICENSE)

Fastify plugin that adds content type parser for the `application/x-www-form-urlencoded` and/or `multipart/form-data` types.

## Description

Essentially a tiny wrapper around [busboy](https://github.com/mscdex/busboy), that parses `application/x-www-form-urlencoded` and/or `multipart/form-data` content types and attaches associated fields to `request.body`.

NB! This plugin does not handle `files`, these get simply discarded as described [here](https://github.com/mscdex/busboy#busboy-special-events).

## Install

```
npm install fastify-simple-form
```

## TypeScript

Although this package includes typings for the plugin itself, you must install ones for node.js and busboy manually:
```
npm install @types/node @types/busboy --save-dev
```

## Usage & Options

### Selectively enable content types to parse

```js
fastify.register(require('fastify-simple-form'), {
  multipart: true,   // Enable parsing for `multipart/form-data`, default: true
  urlencoded: false, // Disable parsing for `application/x-www-form-urlencoded`, default: true
});
```

This plugin has no effect when both options above are set to `false`.

### Options for busboy

Options for busboy can be passed in using `busboyOptions` property which has identical shape to busboy [constructor](https://github.com/mscdex/busboy#busboy-methods), e.g.:

```js
fastify.register(require('fastify-simple-form'), {
  busboyOptions: {
    defCharset: 'utf8',
    limits: {
      fieldNameSize: 100, // Max field name size (in bytes), default: 100
      fieldSize: 1000000, // Max field value size (in bytes), default: 1MB
      fields: 10,         // Max number of non-file fields, default: Infinity
      // ...
    },
  },
});
```

### Prototype poisoning protection

```js
fastify.register(require('fastify-simple-form'), {
  onConstructorPoisoning: 'ignore', // Possible values are 'error', 'remove' and 'ignore'
  onProtoPoisoning: 'error'         // Possible values are 'error', 'remove' and 'ignore'
});
```

- `onConstructorPoisoning`:
  - `error` - throws SyntaxError when a `constructor` key is found
  - `remove` - field will not be attached to `request.body`
  - `ignore` - field be be attached to `request.body`
- `onProtoPoisoning`:
  - `error` - throw SyntaxError when a key matching any property name of `Object.prototype` (besides `constructor`) is found
  - `remove` - field will not be attached to `request.body`
  - `ignore` - field be be attached to `request.body`

Both options will default to what is defined on Fastify root instance (or Fastify own defaults) for safe parsing of JSON objects. See [`onConstructorPoisoning`](https://www.fastify.io/docs/latest/Server/#onprotopoisoning) and [`onProtoPoisoning`](https://www.fastify.io/docs/latest/Server/#onprotopoisoning).

### Example

Given server & handler:

```js
import Fastify from 'fastify';
import SimpleFormPlugin from 'fastify-simple-form';

const fastify = Fastify();

fastify.register(SimpleFormPlugin);

fastify.post(
  '/token',
  {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          grant_type: {
            type: 'string',
            enum: ['password'],
          },
        },
        required: ['grant_type'],
      },
    },
  },
  (request, reply) => {
    reply.send(request.body);
  },
);

fastify.listen(3000);
```

These requests would succeed:

```sh
curl -F "username=jon" -F "password=snow" -F "grant_type=password" \
  localhost:3000/token
```

```sh
curl -d "username=jon" -d "password=snow" -d "grant_type=password" \
  localhost:3000/token
```

Response:

```json
{
  "username": "jon",
  "password": "snow",
  "grant_type": "password"
}
```

While these won't pass the schema validation

```sh
curl -F "username=jon" -F "password=snow" -F "grant_type=refresh_token" \
  localhost:3000/token
```

```sh
curl -d "username=jon" -d "password=snow" -d "grant_type=refresh_token" \
  localhost:3000/token
```

Response

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body.grant_type should be equal to one of the allowed values"
}
```
