/**
 * Created with PyCharm.
 * User: chanhle
 * Date: 7/20/13
 * Time: 9:07 AM
 * To change this template use File | Settings | File Templates.
 */

var CommentSchema = new Schema({
	body : {
		type : String,
		required : true
	},
	created_by : {
		type : Schema.ObjectId,
		ref : 'User',
		index : true
	},
	created_at : {
		type : Date,
		default: Date.now
	},
	updated_at : {
		type : Date
	}
});

CommentSchema.statics.create = function(request, response){
    var comment = new this();
    comment.body = request.body
    comment.created_by = request.created_by
    comment.save(function (err, result, numberAffected) {
        if (err)
            response({"result": "error", "error": err})
        response({"result": "success", "info": result})
    })
}

mongoose.model('Comment', CommentSchema, 'comments');