// /*
//  * GET home page.
//  */

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };

GLOBAL.Accounts = mongoose.model('User');
GLOBAL.LoginToken = mongoose.model('LoginToken');
GLOBAL.Tweet = mongoose.model('Tweet');
GLOBAL.EM = require('../modules/email-dispatcher');
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


var uploads = require('./upload.js');

app.post('/api/photos', uploads.upload);