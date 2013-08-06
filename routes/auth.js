// generate Token when login
var generateToken = function (name, device, response) {
    // remove all token in device user use before
    LoginToken.remove({
        name: name,
        device: device
    }, function (err) {
    });
    if (!name) response('{"error" : "missing name"}');
    else if (!device) response('{"error" : "missing device"}');
    else
        crypto.randomBytes(48, function (ex, buf) {
            var LoginToken = mongoose.model('LoginToken');
            var token = new LoginToken();
            token.name = name;
            token.device = device;
            var tokenString = buf.toString('hex');
            token.series = tokenString;
            token.expire = new Date(Date.now() + 2 * 604800000);
            token.save();
            response(token.series);
        });
}
// Main function

exports.createFollowing = function (request, response) {
    console.log("Create Following", request.body);
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            console.log("SUCCESS");
            Accounts.getObjectIdByName(request.body.name_follow, function (res) {
                request.body.name_follow = res;
                Accounts.createFollowing(request.body, function (result) {
                    response.json(result);
                });
            })

        } else {
            console.log(info);

            response.json(info);
        }
    });
}

exports.getFollowing = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            console.log("SUCCESS");
            Accounts.getFollowing(request.body, function (res) {
                response.json(res);
            })
        } else {
            console.log(info);
            response.json(info);
        }
    });
}


exports.getFollowers = function (request, response) {
    console.log("Get Follower", request.body);
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        console.log("Check Token: ", info);
        if (info == "success") {
            console.log("SUCCESS");
            Accounts.getFollowers(request.body, function (res) {
                response.json(res);
            })
        } else {
            console.log(info);
            response.json(info);
        }
    });
}


exports.validateCode = function (request, response) {
    Accounts.findOne({
        // email : request.body.email,
        salt: request.body.salt
    }, function (err, docs) {
        if (err) {
            throw err;
        } else if (docs) {
            generateToken(docs['name'], request.body.device, function (res) {
                if (res) {
                    response.json({
                        info: success,
                        token: res,
                        name: docs["name"]
                    });
                } else {
                    response.json({
                        error: "cant-create-token"
                    });
                }
            });
        } else
            response.json({
                error: "email-or-validate-code-are-not-correct"
            });
    })
}

exports.resetPassword = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log("RES ", res);
            if (res == "success") {
                console.log("SUCCESS");
                Accounts.updatePassword(request.body.name, request.body.password, function (result) {
                    console.log("Update Password SUCCESS");
                    LoginToken.remove({
                        name: request.body.name
                    }, function (err) {
                        console.log("Remove SUCCESS");
                        response.json({
                            info: "change-pass-success"
                        });
                    });


                })
            } else
                response.json({
                    info: res
                });
        } else {
            response.json({
                error: "cant-check-token"
            });
        }
    })
}

exports.lostPassword = function (request, response) {
    Accounts.findOne({
        email: request.body.email
    }, function (err, docs) {
        if (err) {
            throw err;
        } else if (docs) {
            EM.dispatchResetPasswordLink(docs, function (res) {
                // this response takes a moment to return //
                // should add an ajax loader to give user feedback //
                if (!res) {
                    response.json({
                        info: "email-sent"
                    });
                } else {
                    response.json({
                        error: "mail-server-error"
                    });
                }
            })
        } else
            response.json({
                error: "email-not-found"
            });
    })
}


/*
 Tested function
 */

/*
 Login with with name, password, device name
 */


exports.register = function (request, response) {
    console.log('register ========', request.body)
    Accounts.findOne({
        name: request.body.name
    }, function (err, docs) {
        if (err) {
            logger.error(err);
            throw err;
        } else if (docs) {
            logger.warn(docs);
            response.json({
                error: "username-taken"
            });
        } else {
            Accounts.findOne({
                email: request.body.email
            }, function (err, docs) {
                if (docs) {
                    logger.info('email-taken');
                    response.json({
                        error: "email-taken"
                    });
                } else {
                    var account = new Accounts(request.body);
                    /*
                     * Account basic info
                     * */
                    account.salt = Accounts.makeSalt();
                    account.hashedPass = Accounts.encodePassword(request.body.password, account.salt);
                    account.statuses_count = 0;
                    account.followers = []
                    account.following = []
                    account.followers_count = 0;
                    account.following_count = 0;
                    account.save();
                    logger.info('create user success');
                    /*
                    *
                    * */

                    account_favourite = new Favourite()
                    account_favourite.user_id = account._id
                    account_favourite.save(function (err, result, numberAffected) {
                        if (err)
                            response.json('err', err);
                        else {
                            account.favourite_id = result._id
                            account.save()
                        }
                    })

                    /*
                     * Create TimeLime
                     *
                     * */
                   /* account_timelime = new TimeLime();
                    account_timelime.user_id = account._id
                    account_timelime.save()*/
                    /*
                     * Create HomeStream
                     * */
                    account_homestream = new HomeStream()
                    account_homestream.user_id = account._id
                    account_homestream.save(function (err, result, numberAffected) {
                        if (err)
                            response.json('err', err);
                        else {
                            account.home_stream_id = result._id
                            account.save()
                        }
                    })
                    response.json({
                        info: "success", '_id': account._id
                    });
                }
            });
        }
    });
}


exports.login = function (request, response) {
    logger.info(request.body);
    Accounts.findOne({
        name: request.body.name
    }, function (err, docs) {
        if (!docs) {
            response.json({
                error: "user-not-found"
            });
        } else {
            logger.info(docs);
            Accounts.validatePassword(request.body.password, docs['hashedPass'], docs['salt'], function (error, res) {
                if (error) {
                    logger.error(error);
                    response.json(error);
                }
                logger.warn(res);
                if (res) {
                    generateToken(request.body.name, request.body.device, function (res) {

                        if (res) {
                            Accounts.getObjectIdByName(request.body.name, function (result) {
                            })
                            response.json({
                                token: res,
                                device: request.body.device,
                                account_id: docs._id
                            });
                        } else {
                            logger.error('cant-create-token');
                            response.json({
                                error: "cant-create-token"
                            });
                        }
                    });
                } else {
                    logger.error("invalid-password");
                    response.json({
                        error: "invalid-password"
                    });
                }
            });

        }
    })
}

exports.autoLogin = function (request, response) {
    Accounts.findOne({
        name: request.body.name
    }, function (err, docs) {
        if (err) {
            logger.error(err);
            response.json('{"error": "' + err + '"}');
        }
        if (!request.body.token) {
            logger.error("token not found");
            response.json('{"error": "token-not-found"}');
        } else if (!docs) {
            logger.error("user not found");
            response.json('{"error": "user-not-found"}');
        } else {
            logger.info(docs);
            LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
                if (res) {
                    logger.info(res);
                    response.json({
                        info: res
                    });
                } else {
                    logger.error("can't check token");
                    response.json('{"error" : "cant-check-token"}')
                }
            })
        }
    })
}


exports.updateAccount = function (request, response) {
    Accounts.findOne({
        name: request.body.name
    }, function (err, docs) {
        if (err) {
            response.json({error: err});
        }
        if (!docs) {
            response.json({error: "account-not-found"});
        } else {
            LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
                if (info == "success") {
                    logger.info("Token is success");
                    if (request.body.password) {
                        logger.info("Password Created!");
                        request.body.password = Accounts.encodePassword(request.body.password, docs['salt']);
                    }
                    Accounts.update({
                        'name': request.body.name
                    }, {
                        'hashedPass': request.body.password ? request.body.password : docs['hashedPass'],
                        'screen_name': request.body.screen_name ? request.body.screen_name : docs['screen_name'],
                        'email': request.body.email ? request.body.email : docs['email'],
                        'about': request.body.about ? request.body.about : docs['about'],
                        'location': request.body.location ? request.body.location : docs['location'],
                    }, function (err, numberAffected, raw) {
                        if (err)
                            response.json(err);

                        response.json('{"info": "update-info-success"}');
                        logger.info('The number of updated documents was %d', numberAffected);
                        logger.info('The raw response from Mongo was ', raw);
                    })
                } else {
                    logger.info(info);
                    response.json(info);
                }
            });

        }

    });
}

exports.getInfoUser = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (info) {
        if (info == "success") {
            Accounts.getInfoUser(request.body, function (res) {
                logger.info(res);
                response.json(res);
            })
        } else {
            logger.info(info);
            response.json(info);
        }
    });
}