GLOBAL.mongoose = require('mongoose');
mongoose.set('debug', true);

GLOBAL.Schema = mongoose.Schema;
GLOBAL.mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose);

GLOBAL.crypto = require('crypto');
var colors = require('colors');
GLOBAL.logger = require('tracer').colorConsole({
	format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
	dateformat: "HH:MM:ss.L",
	filters: {
		trace: colors.magenta,
		debug: colors.blue,
		info: colors.green,
		warn: colors.yellow,
		error: [colors.red, colors.bold]
	}
});


// GLOBAL.logger = require('tracer').console({
// 	format: "{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})",
// 	dateformat: "HH:MM:ss.L"
// });


GLOBAL.Email = mongoose.SchemaTypes.Email;
GLOBAL.Url = mongoose.SchemaTypes.Url;
GLOBAL.ObjectId = Schema.ObjectId;
GLOBAL.CommentSchema = require('./comment.js');
GLOBAL.IngredientSchema = require('./ingredient.js');
GLOBAL.CategorySchema = require('./categories.js');
GLOBAL.HomeStreamSchema = require('./home_stream.js');
GLOBAL._ = require('underscore')

require('./user.js');
require('./tweet.js');
require('./dishes.js');
require('./logintoken.js');
require('./email-dispatcher.js');


app.models = mongoose.models;

// connect to mongodb 
//var url = app.config.mongodb_url;
//var url = app.config.mongodb_url_app_frog;
var url = app.config.mongodb_url_mongolab;
mongoose.connect(url);



mongoose.models.User.count({}, function(err, num) {
	console.log('users:', num)
});
mongoose.models.LoginToken.count({}, function(err, num) {
	console.log('token:', num)
});
mongoose.models.Tweet.count({}, function(err, num) {
	console.log('Tweet:', num)
});
module.exports = mongoose.models;