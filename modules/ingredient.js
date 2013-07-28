/**
 * Created with PyCharm.
 * User: chanhle
 * Date: 7/20/13
 * Time: 9:09 AM
 * To change this template use File | Settings | File Templates.
 */

var IngredientSchema = new Schema({
    created_at: { type: Date, default: Date.now }
    , created_by: { type: Schema.ObjectId, ref: "User"}
    , name: String
    , unit: String
});

IngredientSchema.statics.create = function(request, response){
    var ingredient = new this();
    ingredient.name = request.meal_name
    ingredient.unit = request.unit
    ingredient.created_by = request.created_by
    ingredient.save(function (err, result, numberAffected) {
        if (err)
            response({"result": "error", "error": err})
        response({"result": "success", "info": result})
    })
}
    

mongoose.model('Ingredient', IngredientSchema);