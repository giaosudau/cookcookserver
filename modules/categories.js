/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 7/27/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */

CategorySchema = new Schema({
    name: {type: String, required: true, unique: true },
    parent_id: { type: Schema.ObjectId, ref: 'Category' },
    picture: {
        type: String,
        default: "images/default_category.png"
    }
})

mongoose.model('Category', CategorySchema);
