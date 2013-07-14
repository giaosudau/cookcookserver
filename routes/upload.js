exports.upload = function(req, res, next) {
	console.log(req.body);
	console.log(req.files);
	var tmp_path = req.files.source.path;
	var target_path = __dirname + '/photos/' + req.files.source.name;

	console.log(tmp_path);
	console.log(target_path);
	var fs = require('fs');
	/*
		cross-device link not permitted.
	*/
	var contents = fs.readFileSync(tmp_path);
	fs.writeFileSync(target_path, contents);
	fs.unlinkSync(tmp_path);

}; 