/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 8/3/13
 * Time: 10:29 PM
 * To change this template use File | Settings | File Templates.
 */

FavouriteSchema = new Schema({
    user_id: { type: ObjectId, ref: 'User', required: true, unique: true },
    dishes_ids: [
        { type: ObjectId, ref: 'Dishes' }
    ]
})

FavouriteSchema.statics.create = function (req, res) {
    var favourites = new this();
    favourites.user_id = req.account_id
    favourites.save(function (err, product, numberAffected) {
        if (err)
            res('err', err);
        else
            res('success', favourites._id)
    })
}


mongoose.model('Favourite', FavouriteSchema);