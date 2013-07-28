var HomeStreamSchema = new Schema({
    user_id: { type: ObjectId, ref: 'User' }, dishes_ids: [
        { type: ObjectId, ref: 'Dishes' }
    ]
})

HomeStreamSchema.statics.get = function (req, res) {
    mongoose.model('Dishes').find().limit(20).exec(callback)

}

HomeStreamSchema.statics.create = function (req, res) {
    var homestream = new HomeStreamSchema();
    homestream.user_id = res.user_id
    homestream.save();
    homestream.save(function (err, product, numberAffected) {
        if (err)
            response.json('err', err);
        else
            res('success', homestream._id)
    })
}
HomeStreamSchema.statics.getMore = function (req, res) {

}
/*HomeStreamSchema.statics.getUserIdTimeLine = function(req, res){

 }*/

mongoose.model('HomeStream', HomeStreamSchema);
