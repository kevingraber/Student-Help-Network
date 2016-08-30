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

// Passport
// =============================================================
passport.use(new LocalStrategy(
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

// Attaches the id of the user to our session.
passport.serializeUser(function(user, done) {
  	done(null, user.id);
});

// Retrieves the user information from the database and attaches it to the request object as req.user.
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets the connection to MongoDB
mongoose.connect("mongodb://localhost/Student-Help-App-DB");

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


// Initializes passport.
app.use(passport.initialize());
// Required for persistent login sessions.
app.use(passport.session());



// Routes
// =============================================================
require("./app/routes/api-routes.js")(app);
require("./app/routes/html-routes.js")(app);


// Starts the server to begin listening 
// =============================================================
app.listen(PORT, function(){
	console.log('App listening on PORT ' + PORT);
})