const parse = require('./index');
const assert = require('node:assert/strict')
const test = require('node:test');

test('basic flags', () => {
	const argv = parse(['moo', '--honk', 'cow']);

	assert.deepStrictEqual(argv, {
		honk: 'cow',
		_: ['moo'],
	});
});

test('more flags', () => {
	const argv = parse(['moo', '--honk', 'cow', '-p', '55', '--tacos=good']);

	assert.deepStrictEqual(argv, {
		honk: 'cow',
		tacos: 'good',
		p: '55',
		_: ['moo'],
	});
});

test('even more flags', () => {
	const argv = parse(['--aaa', 'true', '--bbb', 'false', '--ccc=true', '--ddd=false']);

	assert.deepStrictEqual(argv, {
		aaa: 'true',
		bbb: 'false',
		ccc: 'true',
		ddd: 'false',
		_: [],
	});
});

test('repeated values accumulate', () => {
	const argv = parse(['-s', 'foo', '-s', 'bar']);
	assert.deepStrictEqual(argv, {
		s: ['foo', 'bar'],
		_: [],
	});
});

test('string accumulates with bool', () => {
	const argv = parse(['--mixed', '--mixed', 'str']);
	assert.deepStrictEqual(argv, {
		mixed: [true, 'str'],
		_: [],
	});
});

test('bool accumulates with string', () => {
	const argv = parse(['--mixed', 'str', '--mixed']);
	assert.deepStrictEqual(argv, {
		mixed: ['str', true],
		_: [],
	});
});

test('boolean groups', () => {
	const argv = parse(['-x', '-z', 'one', 'two', 'three']);

	assert.deepStrictEqual(argv, {
		x: true,
		z: 'one',
		_: ['two', 'three'],
	});
});

test('short -k=v', () => {
	const argv = parse(['-b=123']);
	assert.deepStrictEqual(argv, { b: '123', _: [] });
});

test('multi short -k=v', () => {
	const argv = parse(['-a=whatever', '-b=robots']);
	assert.deepStrictEqual(argv, { a: 'whatever', b: 'robots', _: [] });
});

test('short with embedded equals -k=a=b', () => {
	const argv = parse(['-k=a=b']);
	assert.deepStrictEqual(argv, { k: 'a=b', _: [] });
});

test('short with later equals like -ab=c', () => {
	const argv = parse(['-ab=c']);
	assert.deepStrictEqual(argv, { a: true, b: 'c', _: [] });
});

test('long opts', () => {
	// long boolean
	assert.deepStrictEqual(
		parse(['--bool']),
		{ bool: true, _: [] }
	);

	// long capture sp
	assert.deepStrictEqual(
		parse(['--pow', 'xixxle']),
		{ pow: 'xixxle', _: [] }
	);

	// long capture eq
	assert.deepStrictEqual(
		parse(['--pow=xixxle']),
		{ pow: 'xixxle', _: [] }
	);

	// long captures sp
	assert.deepStrictEqual(
		parse(['--host', 'localhost', '--port', '555']),
		{ host: 'localhost', port: '555', _: [] }
	);

	// long captures eq
	assert.deepStrictEqual(
		parse(['--host=localhost', '--port=555']),
		{ host: 'localhost', port: '555', _: [] }
	);
});

test('long with embedded equals --key=a=b', () => {
	const argv = parse(['--key=a=b']);
	assert.deepStrictEqual(argv, { key: 'a=b', _: [] });
});

test('comprehensive', () => {
	const argv = parse([
		'--name=meowmers', 'bare', '-cats', 'woo',
		'-h', 'awesome', '--multi=quux',
		'--key', 'value',
		'-b', '--bool', '--no-meep', '--multi=baz',
		'--', '--not-a-flag', 'eek',
	]);
	assert.deepStrictEqual(argv, {
		c: true,
		a: true,
		t: true,
		s: 'woo',
		h: 'awesome',
		b: true,
		bool: true,
		key: 'value',
		multi: ['quux', 'baz'],
		'no-meep': true,
		name: 'meowmers',
		_: ['bare', '--not-a-flag', 'eek'],
	});
});

test('newlines in params', () => {
	assert.deepStrictEqual(parse(['-s', 'X\nX']), { _: [], s: 'X\nX' });
	assert.deepStrictEqual(parse(['--s=X\nX']), { _: [], s: 'X\nX' });
});

test('whitespace should be preserved in string values', () => {
	const argv = parse(['-x', '  ', '-y', 'hello world']);

	assert.strictEqual(argv.x, '  ');
	assert.strictEqual(argv.y, 'hello world');
});

test('non-breaking spaces and special characters', () => {
	const s = parse(['\u00A0', '\u00A0', '3'])._;
	
	assert.strictEqual(s.length, 3);
	assert.strictEqual(typeof s[0], 'string');
	assert.strictEqual(s[0], '\u00A0');
	assert.strictEqual(s[1], '\u00A0');
	assert.strictEqual(s[2], '3');
});

test('whitespace within equals sign', () => {
	const argv = parse(['--foo=bar baz']);

	assert.strictEqual(argv.foo, 'bar baz');
});

test('leading/trailing whitespace in keys', () => {
	const argv = parse(['-- foo ', 'bar']);
	
	assert.strictEqual(argv[' foo '], 'bar');
});