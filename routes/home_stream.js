/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 7/27/13
 * Time: 11:46 PM
 * To change this template use File | Settings | File Templates.
 */

exports.get = function (request, response) {
    Dishes.find().limit(4).sort('-created_at').exec(function (err, docs) {
        if (err) response.json("error", error)
        else {
            res = []
            _.each(docs, function (item) {
                item.populate('created_by', 'name screen_name avatar')
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
}

exports.getMore = function (request, response) {
    var created_at = resquest.body.create_at;
    logger.info(created_at)
    Dishes.find()
        .where('create_at').lte(created_at)
        .sort('-created_at')
        .limit(5)
        .exec(function (err, docs) {
            if (err) response.json("error", error)
            else {
                res = []
                _.each(docs, function (item) {
                    item.populate('created_by', 'name screen_name avatar')
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
    /*
     Dishes.find().limit(100).sort('-created_at').exec(function (err, docs) {
     if (err) response.json("error", error)
     else {
     res = []
     _.each(docs, function (item) {
     item.populate('created_by', 'name screen_name avatar')
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
     if(res.length == docs.length){
     response.json({'info': 'success', 'dishes': res})
     }
     });

     })
     })
     logger.warn(res)

     }
     })
     */
}