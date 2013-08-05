/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 8/4/13
 * Time: 4:11 PM
 * To change this template use File | Settings | File Templates.
 */
exports.getAll = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
                Category.find().where('parent_id').equals(null).sort('name').exec(function (err, docs) {
                    if (err) response.json('error', err)
                    else {
                        response.json('info', docs)
                    }
                })

            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}
exports.getChild = function (request, response) {
    if (!request.body.category_id)
        response.json('error', 'category_id-is-null')
    else
        LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
            if (res) {
                console.log(res);
                if (res == "success") {
                    Category.find().where('parent_id').equals(request.body.category_id).sort('name').exec(function (err, docs) {
                        if (err) response.json('error', err)
                        else {
                            response.json('info', docs)
                        }
                    })

                } else
                    response.json(res);
            } else {
                response.json("{error: cant-check-token}")
            }
        })
}

exports.getChildPopulate = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
                Category.findById(request.body.category_id).exec(function (err, docs) {
                    if (err) response.json('error', err)
                    else {
                        docs.populate('parent_id').exec(function(err, result){
                            response.json('info', result)
                        })
                    }
                })

            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}