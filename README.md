# [@nuff-said/args][repo-npm]

A compact and efficient CLI argument parser that supports all major argument
formats, all packed into a _raw code size_ of just **379 bytes!** 3.4x smaller
than the _minzipped size_ of the most popular option, minimist, albeit missing a few features.

Type checking and parsing are non-goals, as a schema parser is a dedicated tool that should be used to this end.

```javascript
const parseArgs = require('@nuff-said/args');
console.log(parseArgs(process.argv.slice(2)));
```

```shell
$ node index --bool=false --num 123 -ar -z false --test hey hey -x= -- --no -more -parse=ing   
{
  _: [ 'hey', '--no', '-more', '-parse=ing' ],
  bool: 'false',
  num: '123',
  a: true,
  r: true,
  z: 'false',
  test: 'hey',
  x: ''
}
```

## Installation

```shell
$ npm i @nuff-said/args
```

## Contributing

All contributions are welcome! Feel free to file an issue, point out an
optimization or even push a PR!

## License

This project uses the GPL-3.0 license.

[repo-npm]: https://npm.im/@nuff-said/args
