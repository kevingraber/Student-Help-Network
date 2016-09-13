// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express 	= require('express');
var bodyParser 	= require('body-parser');
var morgan = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Mentor = require('./app/model/mentor.js');
var Professor = require('./app/model/professor.js');
var Admin = require('./app/model/admin.js');
var exphbs  = require('express-handlebars');

// Passport
// =============================================================

// Local strategy for mentor authentication.
passport.use('mentor', new LocalStrategy(
  function(username, password, done) {
    Mentor.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('Incorrect username.')
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        console.log('Incorrect password.')
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Local strategy for professor authentication.
passport.use('professor', new LocalStrategy(
  function(username, password, done) {
    Professor.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('Incorrect username.')
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        console.log('Incorrect password.')
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Local strategy for admin authentication.
passport.use('admin', new LocalStrategy(
  function(username, password, done) {
    Admin.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log('Incorrect username.')
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        console.log('Incorrect password.')
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// Attaches the id of the user to our session.
passport.serializeUser(function(user, done) {
  console.log(user)
  console.log(user.role)
  console.log(user.id)
  console.log(user.username)
    var userType;
    if (user.role == 'mentor') {
      userType = "mentor";
    } else if (user.role == "professor") {
      userType = "professor";
    } else if (user.role == "admin") {
      userType = "admin";
    } else {
      console.log("There is a problem in the serialization")
    }
  	done(null, { id: user.id, userType: userType } );
});

// Retrieves the user information from the database and attaches it to the request object as req.user.
// passport.deserializeUser(function(id, done) {
//   Professor.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

passport.deserializeUser(function(id, done) {

  if (id.userType == "professor") {
    Professor.findById(id.id, function(err, user) {
      done(err, user);
    });
  } else if (id.userType == "mentor") {
    Mentor.findById(id.id, function(err, user) {
      done(err, user);
    });
  } else if (id.userType == "admin") {
    Admin.findById(id.id, function(err, user) {
      done(err, user);
    });
  } else {
    console.log("There is a problem in the deserialization WHY GOD WHY")
  }

});


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets the connection to MongoDB
// mongoose.connect("mongodb://localhost/Student-Help-App-DB");
mongoose.connect('mongodb://dbadmin:rutgers0451@ds019756.mlab.com:19756/heroku_smj7vwxw');

// Use morgan to log requests to the console.
app.use(morgan('dev'));

// Sets up the Express app to handle data parsing.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

// Allows the serving of static content such as CSS.
app.use(express.static(__dirname + '/app/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initializes passport.
app.use(passport.initialize());
// Required for persistent login sessions.
app.use(passport.session());


app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: 'app/views/layouts'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/app/views');


// Routes
// =============================================================
require("./app/routes/api-routes.js")(app);
require("./app/routes/html-routes.js")(app);


// Starts the server to begin listening 
// =============================================================
app.listen(PORT, function(){
	console.log('App listening on PORT ' + PORT);
})