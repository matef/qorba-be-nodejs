var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI ||
			process.env.MONGOHQ_URL ||
			'mongodb://localhost/test';

mongoose.connect(mongoUri);

var fs = require('fs');
var express = require('express');
var app = express();
var siteRoute = require('./routes/site-routes');
var userRoute = require('./routes/user-routes');
var outingRoute = require('./routes/outing-routes');
//var https = require('https');

var User = require("./model/user");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var privateKey  = fs.readFileSync(__dirname +'/cert/qorba-key.pem', 'utf8');
//var certificate = fs.readFileSync(__dirname +'/cert/qorba-cert.pem', 'utf8');

//var server = https.createServer({key: privateKey, cert: certificate},app);


var passport = require('passport');
var DigestStrategy = require('passport-http').DigestStrategy;

passport.use(new DigestStrategy({ qop: 'auth' },
		  function(username, done) {
			console.log('username sent is ='+username);
		    User.findOne({ username: username }, function (err, user) {
		      if (err) { 
		    	  console.log('error while selecting user by username');
		    	  return done(err); 
		      }
		      if (!user) { 
		    	  console.log('query return empty user');
		    	  return done(null, false); 
		      }
		      console.log('user found ..');		      
		      return done(null, user, user.qaccount.password);
		    });
		  },
		  function(params, done) {
		    // validate nonces as necessary
		    done(null, true);
		  }
));


//config
app.use(logger());
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

//General
app.get('/', siteRoute.index);
app.get('/login',
		siteRoute.logIn);
//user & friends
app.get('/user/:uname',	userRoute.view);
app.post('/user/:uname', userRoute.update);
app.put('/user', userRoute.create);
app.post('/user/:uname/createpasswd',userRoute.createPassword);
//app.post('/user/:uname/add-fb-token', userRoute.createPassword);
app.get('/user/:uname/friends',	userRoute.listFriends);
app.post('/user/:uname/friend/', userRoute.addFriend);
app.get('/user/:uname/outings',	outingRoute.listUserOutings);

//outings
app.get('/outing/:id', outingRoute.view);
app.put('/outing', outingRoute.create);
app.post('/outing/:id', outingRoute.update);
app.post('/outing/:id/join', outingRoute.join);
app.post('/outing/:id/attend', outingRoute.attend);

//listen
//server.listen(3000);
var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
