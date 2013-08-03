/**
 * Created with PyCharm.
 * User: chanhle
 * Date: 7/20/13
 * Time: 9:08 AM
 * To change this template use File | Settings | File Templates.
 */

var DishesSchema = new Schema({
	created_at: {
		type: Date,
		default: Date.now
	},
	created_by: {
		type: Schema.ObjectId,
		ref: "User"
	},
	title: String,
	description: String,
	comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
	time_prepare: String,
    eat_number: Number,
	picture: [String],
	main_picture: String,
	likes: [{
		type: Schema.ObjectId,
		ref: "User"
	}],
	ingredients: [{ type: Schema.ObjectId, ref: 'Ingredient' }],
	categories: [{ type: Schema.ObjectId, ref: 'Category' }],
	steps: [String]
});

DishesSchema.statics.create = function(data, callback) {
	logger.info(data)
	var dish = new this();
	dish.created_by = data.created_by;
	dish.title = data.title;
	dish.time_prepare = data.time_prepare;
	dish.eat_number = data.eat_number;
    dish.description = data.description
    dish.picture = data.picture
    dish.main_picture = data.main_picture
//    create ingredients
    logger.info(data.ingredients)
    logger.info(data.categories)
    if (data.ingredients && data.ingredients.length){
        _.each(data.ingredients, function(ingredient){
            var instance = new Ingredient()
            instance.created_by = data.created_by
            instance.name = ingredient.name
            instance.unit = ingredient.unit
            instance.save()
            dish.ingredients.push(instance._id);
        })
    }
    if (data.categories && data.categories.length){
        _.each(data.categories, function(category){
            var instance = new Category()
            instance.created_by = data.created_by
            instance.name = category.name
            instance.parent_id = category.parent_id
            instance.save()
            dish.categories.push(instance._id);
        })
    }
    dish.steps = data.steps
	dish.save(function(err) {
		if (err)
			callback(err);
		// push to timeline
		// mongoose.model('User').getFollowers(data, function(res){
			// mongoose.model('TimeLine').find({})
		// })

		mongoose.model('Dishes').findOne({
			_id : dish._id
		}).populate('created_by', 'name screen_name avatar').exec(function(err, dish) {
			if (err)
				callback(err);
			console.log('The creator is %s', dish.created_by.screen_name)
			callback(dish);
		});
	});
}

/*DishesSchema.statics.update = function(data, function){
    console.log('Dishes update ', data);
    check
//    get all keys
    var keys = [];
    for(var k in obj){
    } keys.push(k);
}*/

mongoose.model('Dishes', DishesSchema);