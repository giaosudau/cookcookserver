// /*
//  * GET home page.
//  */

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };

GLOBAL.Accounts = mongoose.model('User');
GLOBAL.LoginToken = mongoose.model('LoginToken');
GLOBAL.Tweet = mongoose.model('Tweet');
GLOBAL.Comment = mongoose.model('Comment');
GLOBAL.Ingredient = mongoose.model('Ingredient');
GLOBAL.Category = mongoose.model('Category');
GLOBAL.Dishes = mongoose.model('Dishes');
GLOBAL.HomeStream = mongoose.model('HomeStream');
GLOBAL.EM = require('../modules/email-dispatcher');
GLOBAL._ = require('underscore')
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



var auth = require('./auth.js');
app.get('/auth/validatecode', auth.validateCode);
app.post('/auth/login', auth.login);
app.post('/auth/autologin', auth.autoLogin);
app.post('/auth/register', auth.register);
app.post('/auth/updateinfo', auth.updateAccount);
app.get('/auth/lostpassword', auth.lostPassword);
app.get('/auth/resetpassword', auth.resetPassword);
//
app.get('/auth/createfollowing', auth.createFollowing);
app.get('/auth/getfollowing', auth.getFollowing);
app.get('/auth/getfollowers', auth.getFollowers);
app.get('/auth/getinfouser', auth.getInfoUser);

var tweet = require('./tweet.js');
app.get('/tweet/create', tweet.createTweet);
app.get('/tweet/createcomment', tweet.createComment);
app.get('/tweet/deletecomment', tweet.deleteComment);


var dishes = require('./dishes.js');
app.post('/dishes/create', dishes.create);
app.post('/dishes/update', dishes.update);
app.post('/dishes/delete', dishes.delete);
app.post('/dishes/get', dishes.get);
app.post('/dishes/createComment', dishes.createComment);
app.post('/dishes/deleteComment', dishes.deleteComment);
app.post('/dishes/createIngredient', dishes.createIngredient);

var home_stream = require('./home_stream.js')
app.post('/home/get', home_stream.get);
app.post('/home/getMore', home_stream.getMore);

var uploads = require('./upload.js');
app.post('/api/photos', uploads.upload);