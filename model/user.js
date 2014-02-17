var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = new Schema({	
	username : { 
		type: String, 
		lowercase: true, 
		trim: true, 
		required:true, 
		unique: true
	},
	email : {
		type:String,
		lowercase:true
	},
	fullname : {
		first : String,
		last:String
	},
	profileimg : String,
	friends : [Schema.Types.ObjectId],	
	creationdate : {
		type: Date,
		default: Date.now
	},
	qaccount : {		
		password : String
	},
	fbaccount :{
		access_token:String
	}
	
});
module.exports = mongoose.model('User', User);