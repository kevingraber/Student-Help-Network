// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require('path');

// Routes
// =============================================================
module.exports = function(app){

	app.get('/handlebars', function(req, res) {
		res.render('home');
	});

	app.get('/student', function(req, res){
		res.render('student');
	});

	app.get('/mentor-signup', function(req, res) {
		res.render('mentor-signup');
	})

	// app.get('/student',
	// function(req, res){
	// 	res.sendFile(path.join(__dirname+'/../public/student.html'));
	// });

	app.get('/login',
	function(req, res){
		res.sendFile(path.join(__dirname+'/../public/index.html'));
	});

	app.get('/',
	function(req, res){
		res.sendFile(path.join(__dirname+'/../public/index.html'));
	});

	app.get('/admin',
	function(req, res){
		res.sendFile(path.join(__dirname+'/../public/admin.html'));
	});

	// app.get('/mentor',
	// function(req, res){
	// 	res.sendFile(path.join(__dirname+'/../public/mentor.html'));
	// });

	app.get('/professor',
	function(req, res){
		res.sendFile(path.join(__dirname+'/../public/professor.html'));
	});

}
