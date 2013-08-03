/**
 * Created with PyCharm.
 * User: chanhle
 * Date: 7/20/13
 * Time: 9:36 AM
 * To change this template use File | Settings | File Templates.
 */

exports.template = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
//


            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}


/*
 *
 *
 * */

function get_dish(request, response) {
    Dishes.findById(request.body._id, function (err, docs) {
        if (err) response.json('error', err)
        else {
            if (docs) {
                docs.populate('created_by', 'name screen_name avatar')
                    .populate('categories')
                    .populate('ingredients', 'name unit')
                    .populate('comments', function (err, dishes) {
                        Comment.populate(docs, {
                            path: 'comments.created_by',
                            select: 'name screen_name avatar',
                            model: 'User'
                        }, function (err, result) {
                            response.json(result)
                        });

                    })
            }
        }
    })
}
exports.get = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
                get_dish(request, response);

            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}


/*
 * name, token, device
 * dishes info: user_name
 *
 */


exports.create = function (request, response) {
//    check token first
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
                Accounts.getObjectIdByName(request.body.name, function (result) {
                    console.log("ID By Name ", request.body, "ID ", result)
                    request.body.created_by = result;
                    Dishes.create(request.body, function (result) {
                        console.log(request.body)
                        result.populate('created_by', 'name screen_name avatar')
                            .populate('categories')
                            .populate('ingredients')
                            .populate('comments', function (err, dishes) {
                                console.log('xxxxxxxxxxxxxxxx', result);
                                Comment.populate(result, {
                                    path: 'comments.created_by',
                                    select: 'name screen_name avatar',
                                    model: 'User'
                                }, function (err, result) {
                                    response.json(result)
                                });

                            })
//                        response.json(result);
                    })
                })
            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}

/*
 * name, token, device to check token
 * _id dishes, content to update
 *
 * */
exports.update = function (request, response) {
//    check token first
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
//                check dishes id
                var query = { _id: request.body._id }
                Dishes.findOne(query, function (err, doc) {
                    if (err)
                        response.json('error', err)

                    if (!doc) response.json('error', 'not-found-dishes')

                    else {

                        for (var k in request.body) {
                            if (!_.contains(['name', 'token', 'device', '_id', 'ingredients', 'categories'], k)) {
                                doc[k] = request.body[k];
                            }
                            if (k == 'ingredients') {
                                doc[k] = []
                                _.each(request.body[k], function (instance) {
                                    if (instance._id) {
                                        doc[k].push(instance._id)
                                    }
                                    else if (instance.name && instance.unit) {
                                        item = new Ingredient()
                                        item.name = instance.name
                                        item.unit = instance.unit
                                        item.save()
                                        doc[k].push(item._id)
                                    }
                                })

                            }
                            if (k == 'categories') {
                                doc[k] = []
                                _.each(request.body[k], function (item) {
                                    if (item._id) {
                                        doc[k].push(item._id)
                                    }
                                    if (item.name) {
                                        Category.findOne({
                                            name: item.name,
                                            parent_id: item.parent_id
                                        }, function (err, docs) {
                                            if (err)
                                                response.json('error', err)
                                            else {
                                                if (docs) {
                                                    doc.categories.push(docs._id)
                                                }
                                                else {
                                                    var item = new Category()
                                                    item.name = item.name
                                                    item.parent_id = item.parent_id
                                                    item.save()
                                                    doc.categories.push(item._id)
                                                }
                                            }
                                        });

                                    }
                                })
                            }
                        }
                        doc.save(function (err, product, numberAffected) {
                            if (err)
                                response.json('err', err);
                            else {
                                product.populate('created_by', 'name screen_name avatar')
                                    .populate('ingredients')
                                    .populate('categories')
                                    .populate('comments', function (err, dishes) {
                                        Comment.populate(product, {
                                            path: 'comments.created_by',
                                            select: 'name screen_name avatar',
                                            model: 'User'
                                        }, function (err, result) {
                                            response.json({'info': 'success', 'dishes': result, 'numberAffected': numberAffected})
                                        });

                                    })
                            }

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

exports.delete = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
//                check dishes id
                var query = { _id: request.body._id }
                Dishes.findByIdAndRemove(request.body._id, function (err, result) {
                    if (err)
                        response.json('error', err)
                    if (!result) response.json('error', 'not-found-dishes')
                    response.json('info', result)
                })

            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}


exports.createComment = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            logger.info('------------', request.body)
            if (res == "success") {
                Comment.create(request.body, function (result) {
                    logger.info(result)
                    if (result.result == 'error')
                        response.json("error", result.error)
                    mongoose.model('Dishes').findById(
                        request.body._id
                        , function (err, docs) {
                            if (err)
                                response.json('error', err);

                            if (!docs) response.json('error', 'not-found-dishes')

                            docs.comments.push(result.info._id);
                            docs.save(function (err, product, numberAffected) {
                                if (err)
                                    response.json("error", err)
                                docs.populate('created_by', 'name screen_name avatar')
                                    .populate('comments', function (err, dishes) {
                                        console.log('xxxxxxxxxxxxxxxx', docs);
                                        Comment.populate(docs, {
                                            path: 'comments.created_by',
                                            select: 'name screen_name avatar',
                                            model: 'User'
                                        }, function (err, result) {
                                            response.json(result)
                                        });

                                    })
                            })


                        })

                })


            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}

/*
 * name, token, device to checktoken
 * dishes_id, comment_id
 *
 * */
exports.deleteComment = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            if (res == 'success') {
                Comment.findByIdAndRemove(request.body.comment_id, function (err, result) {
                    if (err) response.json('error', err)

                    else if (!result) {
                        response.json('error', 'not-found-comment')
                    }
                    else {
                        logger.info(result)
                        Dishes.findById(request.body._id, function (err, docs) {
                            if (err) response.json('error', err)
                            if (!docs) response.json('error', 'not-found-dishes')
                            else {
                                var idx = docs.comments ? docs.comments.indexOf(request.body.comment_id) : -1;
                                // is it valid?
                                console.log('-------------------\n', idx)
                                if (idx !== -1) {
                                    console.log('do ===================')
                                    docs.comments.splice(idx, 1);
                                    // save the doc
                                    docs.save(function (error) {
                                        if (error) {
                                            console.log(error);
                                            response.json('error', error);
                                        } else {
                                            response.json('info', 'success')
                                        }
                                    });
                                }
                                else
                                    response.json('error', 'not-found-comment-in-dishes')
                            }
                        })
                    }

                })

            }
            else
                response.json(res)

        }
        else response.json('error', 'cant-check-token')


    })
}


/*
 * login: name, token, device
 * meal_name, unit
 * */

exports.createIngredient = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            logger.info('------------', request.body)
            if (res == "success") {
                Ingredient.create(request.body, function (result) {
                    logger.info(result)
                    if (result.result == 'error')
                        response.json("error", result.error)
                    mongoose.model('Dishes').findById(
                        request.body._id
                        , function (err, docs) {
                            if (err)
                                response.json('error', err);

                            if (!docs) response.json('error', 'not-found-dishes')

                            docs.ingredients.push(result.info._id);
                            docs.save(function (err, product, numberAffected) {
                                if (err)
                                    response.json("error", err)
                                docs.populate('created_by', 'name screen_name avatar')
                                    .populate('ingredients', function (err, dishes) {
                                        console.log('xxxxxxxxxxxxxxxx', docs);
                                        Ingredient.populate(docs, 'name unit', function (err, result) {
                                            response.json(result)
                                        });

                                    })
                            })


                        })

                })


            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}

exports.like = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
//
                Dishes.findById(request.body._id, function (err, docs) {
                    if (err)
                        response.json('error', err)
                    else {
                        if (docs) {
                            var indexOfAccountId = docs.likes.indexOf(request.body.account_id);
                            if (indexOfAccountId >= 0) {
                                docs.likes.splice(indexOfAccountId, 1)
                                Favourite.findOne({user_id: request.body.account_id}, function(err, doc){
                                    if(err) response.json('error', err)
                                    else {
                                        logger.info(doc)
                                        if(doc){
                                            var indexOfDishId = doc.dishes_ids.indexOf(request.body._id);
                                            if (indexOfDishId>=0){
                                                doc.dishes_ids.splice(request.body._id, 1)
                                                doc.save()
                                            }
                                        }
                                        else{
                                            Favourite.create(request.body, function(result){
                                                console.log('create', result)
                                            })
                                        }
                                    }
                                })
                            }
                            else {
                                docs.likes.push(request.body.account_id)
                                Favourite.findOne({user_id: request.body.account_id}, function(err, doc){
                                    if(err) response.json('error', err)
                                    else {
                                        logger.info(doc)
                                        if(doc){
                                              doc.dishes_ids.push(request.body._id)
                                            doc.save()
                                        }
                                        else{
                                            Favourite.create(request.body, function(result){
                                                console.log('create', result)
                                            })
                                        }
                                    }
                                })
                            }

                            docs.save(function (err, product, numberAffected) {
                                if (err)
                                    response.json('err', err);
                                else {
                                    product.populate('created_by', 'name screen_name avatar')
                                        .populate('ingredients')
                                        .populate('categories')
                                        .populate('likes', 'name screen_name avatar')
                                        .populate('categories')
                                        .populate('comments', function (err, dishes) {
                                            Comment.populate(product, {
                                                path: 'comments.created_by',
                                                select: 'name screen_name avatar',
                                                model: 'User'
                                            }, function (err, result) {
                                                response.json({'info': 'success', 'dishes': result, 'numberAffected': numberAffected})
                                            });

                                        })
                                }

                            })


                        }
                        else {
                            response.json('info', docs)
                        }
                    }
                })


            } else
                response.json(res);
        } else {
            response.json("{error: cant-check-token}")
        }
    })
}