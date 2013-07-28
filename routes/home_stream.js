/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 7/27/13
 * Time: 11:46 PM
 * To change this template use File | Settings | File Templates.
 */

exports.get = function (request, response) {

    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            Dishes.find().limit(10).sort('-created_at').exec(function (err, docs) {
                if (err) response.json("error", error)
                else {
                    res = []
                    _.each(docs, function (item) {
                        item
                            .populate('created_by', 'name screen_name avatar')
                            .populate('ingredients')
                            .populate('categories')
                            .populate('comments', function (err, dishes) {
                                if (err) response.json('error', err)
                                else
                                    Comment.populate(item, {
                                        path: 'comments.created_by',
                                        select: 'name screen_name avatar',
                                        model: 'User'
                                    }, function (err, result) {
                                        logger.info(result)
                                        res.push(result)
                                        if (res.length == docs.length) {
                                            response.json({'info': 'success', 'dishes': res})
                                        }
                                    });

                            })
                    })
                    logger.warn(res)

                }
            })

        } else {
            console.log(info);
            response.json(info);
        }
    });


}

exports.getMore = function (request, response) {
    var created_at = request.body.created_at;
    if(!created_at){
        response.json({"error" :'created-at-missed'})
    }
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            Dishes.find()
                .where('created_at')
                .lte(created_at)
                .sort('-created_at')
                .limit(10)
                .exec(function (err, docs) {
                    if (err) response.json("error", err)
                    else {
                        res = []
                        _.each(docs, function (item) {
                            item
                                .populate('created_by', 'name screen_name avatar')
                                .populate('ingredients')
                                .populate('categories')
                                .populate('comments', function (err, dishes) {
                                    if (err) response.json('error', err)
                                    else
                                        Comment.populate(item, {
                                            path: 'comments.created_by',
                                            select: 'name screen_name avatar',
                                            model: 'User'
                                        }, function (err, result) {
                                            logger.info(result)
                                            res.push(result)
                                            if (res.length == docs.length) {
                                                response.json({'info': 'success', 'dishes': res})
                                            }
                                        });

                                })
                        })
                    }

                })

        } else {
            console.log(info);
            response.json(info);
        }
    });


}