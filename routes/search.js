/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 7/31/13
 * Time: 10:44 PM
 * To change this template use File | Settings | File Templates.
 */
exports.searchUser = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        if (info == "success") {
            var name = request.body.search_string;
            Accounts.find().or([
                    { name: new RegExp(name, "i") },
                    { screen_name: new RegExp(name, "i") }
                ]).limit(10).exec(function (err, docs) {
                    if (err) {
                        response.json('error', err)
                    }
                    else {
                        response.json('info', docs)
                    }

                })
        } else {
            console.log(info);
            response.json(info);
        }
    });
}

exports.searchDishes = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        if (info == "success") {
            var name = request.body.search_string;
            var search_option = []
            if (request.body.option_title) {
                search_option.push({ title: new RegExp(name, "i") })
            }
            if (request.body.option_ingredients) {
                search_option.push({ 'ingredients.name': new RegExp(name, "i") })
            }
            if (request.body.option_steps) {
                search_option.push({ steps: new RegExp(name, "i") })
            }
            Dishes.find().or(search_option).sort('-created_at').limit(10).exec(function (err, docs) {
                if (err) {
                    response.json('error', err)
                }
                else {

                    if (docs) {
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

                    else {
                        response.json('info', docs)
                    }

                }

            })
        } else {
            console.log(info);
            response.json(info);
        }
    });

}