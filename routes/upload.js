var path = require('path')
exports.upload = function (req, res, next) {
   // console.log(JSON.stringify(req))
    LoginToken.checkTokenIsExpired(req.body.name, req.body.token, req.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            console.log(req.body);
            console.log(req.files.files);
            var tmp_path = req.files.files.path;



            var target_path = '/public/photos/' + tmp_path.substring(tmp_path.length-15, tmp_path.length) + req.files.files.name;
            var return_path = 'photos/' + tmp_path.substring(tmp_path.length-15, tmp_path.length) + req.files.files.name;
            target_path = path.join(__dirname, '..', target_path)

            console.log(tmp_path);
            console.log(target_path);
            logger.info(target_path)
            logger.info(return_path)
            var fs = require('fs');
            /*
             cross-device link not permitted.
             */

            fs.readFile(tmp_path, function (err, data) {
                if (err) {
                    res.json({'error': err});
                    throw err;
                }
                fs.writeFile(target_path, data, function (err) {
                    if (err) {
                        res.json({'error': err});
                        throw err;
                    }
                    console.log('It\'s saved!');
                    res.json({'success': return_path});
                    fs.unlinkSync(tmp_path);
                });
            });


//            var contents = fs.readFileSync(tmp_path);
//            logger.info(contents)
//            fs.writeFileSync(target_path, contents);
//            fs.unlinkSync(tmp_path);
//			res.json({'success': return_path});
//            logger.info(res)
        } else {
            logger.error(info)
            res.json(info);
        }
    });


};