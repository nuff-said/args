const nanoargs = require('./index');
// *(?:-+([^= \d]+)[= ]?)?(?:([\'\"])([^\2]+?)\2|([^- \"\']+))?

const assert = (text, cond) => {
	if (!cond()) {
		console.error('FAILED:', text)
		process.exit(1)
	}
	console.log('PASS', text)
}

assert('It parses --flag=val', () => {
	const parsed = nanoargs('--bool=false --num=123 --str=yes'.split(' '))
	return parsed.flags.bool === false && parsed.flags.num === 123 && parsed.flags.str === 'yes';
})

assert('It parses --flag val', () => {
	const parsed = nanoargs('--bool false --num 123 --str yes'.split(' '))
	return parsed.flags.bool === false && parsed.flags.num === 123 && parsed.flags.str === 'yes';
})

assert('It parses -args', () => {
	const parsed = nanoargs('-ar -z true -x=false -y2'.split(' '))
	return parsed.flags.a && parsed.flags.r && parsed.flags.y === 2 && parsed.flags.x === false && parsed.flags.z === true;
})

assert('It parses --args', () => {
	const parsed = nanoargs('--args --here'.split(' '))
	return parsed.flags.args && parsed.flags.here;
})

assert('It parses --no-args', () => {
	const parsed = nanoargs('--no-flag'.split(' '))
	return parsed.flags.flag === false;
})

assert('It parses positionals', () => {
	const parsed = nanoargs('hey hey'.split(' '))
	return parsed._.every(x => x === 'hey');
})

assert('It parses special chars', () => {
	const parsed = nanoargs('--arg=hey="hmm" -f=/usr/local/bin'.split(' '))
	return parsed.flags.arg === 'hey="hmm"' && parsed.flags.f === "/usr/local/bin"
})

assert('It parses numbers', () => {
	const parsed = nanoargs('--pi 3.14 -e=2e3 --life=42'.split(' '))
	return parsed.flags.pi === 3.14 && parsed.flags.e === 2e3 && parsed.flags.life === 42;
})

assert('It parses empty flags', () => {
	const parsed = nanoargs('-x= lol'.split(' '))
	return parsed.flags.x === '';
})

assert('It parses double dash', () => {
	const parsed = nanoargs('-- --foo -x=n --'.split(' '))
	return parsed.extras[0] === '--foo' && parsed.extras[1] === '-x=n';
})
