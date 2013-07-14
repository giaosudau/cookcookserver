var LoginToken = new Schema({
	created_at: {
		type: Date,
		default: Date.now
	},
	name: String,
	expire: Date,
	series: {
		type: String,
		required: true
	},
	device: {
		type: String,
		required: true
	}
});

LoginToken.statics.checkTokenIsExpired = function(name, token, device, res) {
	console.log("INFO: ", name, token, device);
	this.findOne({
		$and: [{
				"name": name
			}, {
				"series": token
			}, {
				"device": device
			}
		]
	}, function(error, info) {
		if (error) {
			logger.error(error);
			res(error);
		} else if (info) {
			var expire = new String(info['expire']);
			var date = new Date(expire);
			if (date >= new Date()) {
				res("success");
			} else {
				logger.warn("expired token");
				res('{"error": "token-has-expired"}');
			}
		} else {
			logger.warn("token not found");
			res('{"error": "token-not-found"}');
		}
	});
}

mongoose.model('LoginToken', LoginToken);