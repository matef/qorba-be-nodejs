
exports.index = function(req, res){
  res.end("root of services ...");
};

exports.logIn = function(req, res){
	res.set('Content-Type', 'application/json');
	res.json({
		status : "success",
		data : {
			username:req.user.username,
			id:req.user._id
		}
	});	
}