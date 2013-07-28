/**
 * Created with JetBrains WebStorm.
 * User: chanhle
 * Date: 7/27/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */

CategorySchema = new Schema({
    name: String,
    parent_id: { type: Schema.ObjectId, ref: 'Category' }
})

mongoose.model('Category', CategorySchema);
