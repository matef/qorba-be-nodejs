
exports.index = function(req, res){
  res.end("root of services ...");
};

exports.logIn = function(req, res){
	console.log(req.body);
	res.end("logged in .. :) ");
}