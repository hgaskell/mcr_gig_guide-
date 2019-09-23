var mongoose = require("mongoose");

var gigSchema = new mongoose.Schema({
    event: String,
	price: String,
	link: String,
	venue: String,
	date: String,
    image: String,
    description: String,
	location: String,
	lat: Number,
	lng: Number,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

module.exports = mongoose.model("Gig", gigSchema);