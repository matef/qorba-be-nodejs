var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Outing = new Schema({
	outingdate : Date,
	location: {
		geometry : {
			longtude : Number,
			viewpoint : Number
		},
		img : String
	},
	description : String,
	details : String,
	creationdate : { type: Date, default: Date.now},
	createdby : Schema.Types.ObjectId,
	joiners : [Schema.Types.ObjectId],
	attendees : [Schema.Types.ObjectId]
});
module.exports = mongoose.model('Outing', Outing);