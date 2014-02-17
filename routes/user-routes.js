var User = require("../model/user");

var userRoutes = {
	view : function(req, res) {
		var userid = req.params.id;
		User.findById(userid, function(err, user) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			if (!user) {
				console.log('no user found ... ');
				res.set('Content-Type', 'application/json');
				res.json('{result:"not found"}');
				return;
			}
			console.log('current user is found' + JSON.stringify(user));
			res.set('Content-Type', 'application/json');
			res.json(user);
		});
	},
	update : function(req, res) {
		/**
		 * to be implemented
		 */
	},
	create : function(req, res) {
		var requser = req.body;
		console.log('user full name = ' + requser.fullname);
		var user = new User({
			username : requser.username,
			email : requser.email,
			fullname : requser.fullname,
			profileimg : requser.profileimg
		});
		user.save();

		res.set('Content-Type', 'application/json');
		res.json(user);
	},	
	createPassword : function(req,res){
		var userid = req.params.id;
		var password = req.body.password;
		User.findById(userid, function(err, user) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			user.qaccount.password = password;
			user.save();
			res.set('Content-Type', 'application/json');
			res.json(user);
		});
	},	
	addFriend : function(req, res) {
		var userid = req.params.id;
		var friendid = req.body.friendid;
		User.findById(userid, function(err, user) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			if (user.friends instanceof Array) {
				user.friends.push(friendid);
			} else {
				user.friends = [ friendid ];
			}
			user.save(function(err) {
				if (err) {
					console.log('retrieval error');
					throw err;
				}
				console.log('new friend added successfully ...');

				res.set('Content-Type', 'application/json');
				res.json('{status:done}');
			});

		});
	},
	listFriends : function(req, res) {
		var userid = req.params.id;
		User.findById(userid, function(err, user) {
			if (err) {
				console.log('retrieval error');
				throw err;
			}
			User.find({
				_id : {
					$in : user.friends
				}
			}, function(err, users) {
				res.set('Content-Type', 'application/json');
				res.json(users);
			});
		});
	}
	
	
};

// export an object for single tone pattern
module.exports = userRoutes;