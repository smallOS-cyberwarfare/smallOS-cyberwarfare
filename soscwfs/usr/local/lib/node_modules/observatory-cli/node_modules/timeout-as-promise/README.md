# timeout-as-promise

`setTimeout` as a native `Promise`.

[![npm Version][npm-badge]][npm]
[![Build Status][build-badge]][build-status]
[![Test Coverage][coverage-badge]][coverage-result]
[![Dependency Status][dep-badge]][dep-status]

## Installation

Install using npm:

    $ npm install timeout-as-promise

## Usage

```js
var delay = require('timeout-as-promise');

delay().then(function() {
    console.log('nextTick!');
});

delay(5000).then(function() {
    console.log('5 seconds have passed!');
});

delay(5000, 'Jim').then(function(value) {
    console.log('my name is ' + value);
});

Promise.resolve(42)
    .then(function(result) {
        return delay(150, result);
    })
    .then(function(result) {
        console.log('result is ' + result); //=> 42
    });
```

## License

MIT

[build-badge]: https://img.shields.io/travis/jimf/timeout-as-promise/master.svg
[build-status]: https://travis-ci.org/jimf/timeout-as-promise
[npm-badge]: https://img.shields.io/npm/v/timeout-as-promise.svg
[npm]: https://www.npmjs.org/package/timeout-as-promise
[coverage-badge]: https://img.shields.io/coveralls/jimf/timeout-as-promise.svg
[coverage-result]: https://coveralls.io/r/jimf/timeout-as-promise
[dep-badge]: https://img.shields.io/david/jimf/timeout-as-promise.svg
[dep-status]: https://david-dm.org/jimf/timeout-as-promise
