var colors = require('colors');
var logger = require('tracer').colorConsole({
	filters: {
		log : colors.black,
		trace: colors.magenta,
		debug: colors.blue,
		info: colors.green,
		warn: colors.yellow,
		error: [colors.red, colors.bold]
	}
});