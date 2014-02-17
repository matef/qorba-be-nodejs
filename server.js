var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var fs = require('fs');
var express = require('express');
var app = express();
var siteRoute = require('./routes/site');
var userRoute = require('./routes/user-routes');
var outingRoute = require('./routes/outing-routes');
var https = require('https');

var User = require("./model/user");

var privateKey  = fs.readFileSync(__dirname +'/cert/qorba-key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname +'/cert/qorba-cert.pem', 'utf8');

var server = https.createServer({key: privateKey, cert: certificate},app);


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
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

//General
app.get('/', siteRoute.index);

//user
app.get('/user/:id',
		passport.authenticate('digest', { session: false }),
		userRoute.view);
app.put('/user', userRoute.create);
app.post('/user/:id', userRoute.update);
app.post('/user/:id/createpasswd', userRoute.createPassword);
//app.post('/user/:id/add-fb-token', userRoute.createPassword);


app.get('/user/:id/friends', userRoute.listFriends);
app.post('/user/:id/friend/',userRoute.addFriend);


app.get('/outing/:id', outingRoute.view);
app.put('/outing', outingRoute.create);
app.post('/outing/:id', outingRoute.update);

app.get('/user/:id/outings',outingRoute.listUserOutings);

//listen
server.listen(3000);
console.log('Express app started on port 3000');