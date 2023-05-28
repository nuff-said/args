# [@nuff-said/args][repo-npm]

A compact and efficient CLI argument parser that supports all major argument
formats, all packed into a minzipped code size of just **325 bytes!** 4x smaller
than the most popular option, minimist.

```javascript
const parseArgs = require('@nuff-said/args');
console.log(parseArgs(process.argv.slice(2)));
```

```shell
$ node index bool=false --num 123 -ar -z false --no-test hey hey -e2e3 -x= -- --no -more -parse=ing
{
  flags: { test: false, num: 123, x: '', z: false, a: true, r: true, e: 2000 },
  _: [ 'bool=false', 'hey', 'hey' ],
  extras: [ '--no', '-more', '-parse=ing' ]
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
