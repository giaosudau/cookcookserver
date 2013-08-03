/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 8/4/13
 * Time: 12:38 AM
 * To change this template use File | Settings | File Templates.
 */
exports.get = function (request, response) {
    LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function (res) {
        if (res) {
            console.log(res);
            if (res == "success") {
                Favourite.findOne({user_id : request.body.account_id}, function(err, doc){
                    if(err) response.json('error', err)
                    else {
                        if(doc){
                            doc.populate('dishes_ids', function (err, dishes) {
                                logger.info(doc)
                                logger.info(dishes)
                                response.json('info', dishes)
                            })
                        }
                        else {

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