var Outing = require("../model/outing");
var User = require("../model/user");
var validator = require('validator');

var outingRoutes = {

	listUserOutings : function(req, res) {
		var userid = req.params.id;
		console.log('retrieving all outing for user = ' + userid);
		Outing.find({
			createdby : userid
		}, function(err, docs) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			console.log('documents are loaded successfully');			
			res.set('Content-Type', 'application/json');
			res.json({
				status : "success",
				data : docs
			});
		});
	},
	
	listFriendsOutings : function(req, res) {
		var userid = req.body.userid;
		User.findById(userid, function(err, user) {
			if (err) {
				console.log('user retrieval error');
				throw err;
			}
			console.log('user found ..');
			console.log('user has ' + user.friends.length + " friends .. ");

			Outing.find({
				createdby : {
					$in : user.friends
				}
			}, function(err, outings) {
				console.log('there are ' + outings.length+ ' frinds outings found ...');
				res.set('Content-Type', 'application/json');
				res.set('Content-Type', 'application/json');
				res.json({
					status : "success",
					data : outings
				});
			});
		});
	},
	
	view : function(req, res) {
		var outingid = req.params.id;
		Outing.findById(outingid, function(err, doc) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			console.log('document is loaded successfully');
			res.set('Content-Type', 'application/json');
			res.set('Content-Type', 'application/json');
			res.json({
				status : "success",
				data : doc
			});
		});
	},
	
	update : function(req, res) {
		var reqouting = req.body;
		Outing.findById(reqouting._id, function(err, outing) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			outing.outingdate = reqouting.outingdate;
			outing.location = {
				geometry : {
					longtude : reqouting.location.longtude,
					viewpoint : reqouting.location.viewpoint
				}
			};
			outing.description = reqouting.description;
			outing.detainls = reqouting.details;
			outing.createdby = reqouting.createdby;

			outing.update();
			res.set('Content-Type', 'application/json');
			res.json({
				status : "success",
				data : outing
			});
		});
	},
	
	create : function(req, res) {
		var reqouting = req.body;
		if (validator.isNull(reqouting.outingdate) ||
				!validator.isDate(reqouting.outingdate)){
			res.set('Content-Type', 'application/json');
			res.json({
				status : "validation-error",
				data : "outing date is mandatory"
			});
		} else {
			var newouting = new Outing({
				outingdate : reqouting.outingdate,
				location : {
					geometry : {
						longtude : reqouting.location.longtude,
						viewpoint : reqouting.location.viewpoint
					}
				},
				description : reqouting.description,
				detainls : reqouting.details,
				createdby : reqouting.createdby
			});
			newouting.save();
			res.set('Content-Type', 'application/json');
			res.json({
				status : "success",
				data : newouting
			});
		}
	},
	
	join : function(req,res){
		var outingid = req.params.id;
		var joinerid = req.body.joinerid;
		
		Outing.findById(outingid, function(err, outing) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			if(outing.joiners.indexOf(joinerid)){
				outing.joiners.push(joinerid);
				outing.save();
				res.set('Content-Type', 'application/json');
				res.json({
					status : "success",
					data : outing
				});
			}
			else{
				res.set('Content-Type', 'application/json');
				res.json({
					status : "error",
					message : "joiner already exists",
					data : outing
				});
			}
		});
	},
	
	attend : function(req,res){
		var outingid = req.params.id;
		var attendeeid = req.body.attendeeid;
		
		Outing.findById(outingid, function(err, outing) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			if(outing.attendees.indexOf(attendeeid)){
				outing.attendees.push(attendeeid);
				outing.save();
				res.set('Content-Type', 'application/json');
				res.json({
					status : "success",
					data : outing
				});
			}
			else{
				res.set('Content-Type', 'application/json');
				res.json({
					status : "error",
					message : "attendee already exists",
					data : outing
				});
			}
		});
	}
	
};

module.exports = outingRoutes;
