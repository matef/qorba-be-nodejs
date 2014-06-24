var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var states = 'created closed'.split(' ')
var Outing = new Schema({
	outingdate : Date,
	location: {
		geometry : {
			longtude : Number,
			viewpoint : Number
		},
		img : String,
		description : String
	},
	comment : String,
	details : String,
	creationdate : { type: Date, default: Date.now},
	createdby : String,
	joiners : [{
		type: Schema.Types.ObjectId, 
		ref:'User'
	}],
	attendees : [{
		type:Schema.Types.ObjectId,
		ref:'User'
	}],
	state:{ 
		type: String, 
		enum: states,
		default:states[0]
	}
});
module.exports = mongoose.model('Outing', Outing);
