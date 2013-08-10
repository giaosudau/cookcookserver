exports.upload = function (req, res, next) {
    console.log(JSON.stringify(req))
    LoginToken.checkTokenIsExpired(req.body.name, req.body.token, req.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            console.log(req.body);
            console.log(req.files.files);
            var tmp_path = req.files.files.path;
            var target_path = '../public/photos/' + tmp_path.substring(tmp_path.length-15, tmp_path.length) + req.files.files.name;
            var return_path = '/photos/' + tmp_path.substring(tmp_path.length-15, tmp_path.length) + req.files.files.name;

            console.log(tmp_path);
            console.log(target_path);
            var fs = require('fs');
            /*
             cross-device link not permitted.
             */
            var contents = fs.readFileSync(tmp_path);
            fs.writeFileSync(target_path, contents);
            fs.unlinkSync(tmp_path);
            res.json('success', return_path)
        } else {
            console.log(info);
            res.json(info);
        }
    });


};