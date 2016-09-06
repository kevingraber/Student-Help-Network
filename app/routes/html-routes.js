// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require('path');
var Student = require('../model/student.js');
var Mentor = require('../model/mentor.js');
var Professor = require('../model/professor.js');

// Routes
// =============================================================
module.exports = function(app){

	// Landing Page
	app.get('/', function(req, res){
		if (req.user) {
			res.redirect('/'+req.user.role)
		} else {
			res.render('login');
		}
	});

	// Student Routes.
	// =========================================================

	// Student request route.
	app.get('/student', function(req, res){
		res.render('student');
	});

	// Mentor Routes.
	// =========================================================

	// Mentor registration.
	app.get('/mentor-signup', function(req, res) {
		res.render('mentor-signup');
	});

	// Mentor main page.
	app.get('/mentor', isAuthenticatedMentor, function(req, res) {
		Mentor.findOne({_id: req.user.id}).populate('mentoring').exec(function(err, mentor) {
			if (err) res.send(err);
			res.render('mentor', {user: mentor});
		});
	});

	// Mentor account info page.
	app.get('/mentor/account', isAuthenticatedMentor, function(req, res) {
		res.render('mentor-account', {user: req.user})
	});

	// Professor Routes.
	// =========================================================

	// Professor main page.
	app.get('/professor', isAuthenticatedProfessor, function(req, res) {
		Mentor.find({section: req.user.section, approved: null}, function(err, students) {
			if (err) res.send(err);
			res.render('professor', {user: req.user, pendingmentor: students})
		});
		// res.render('professor', {user: req.user})
	});

	// Professor account info page.
	app.get('/professor/account', isAuthenticatedProfessor, function(req, res) {
		res.render('professor-account', {user: req.user})
	});

	// Admin Routes.
	// =========================================================

	app.get('/admin', function(req, res){
		res.sendFile(path.join(__dirname+'/../public/admin.html'));
	});

	// Functions! Yay!
	// =========================================================

	// Checks to see if the user is a successfully authenticated mentor.
	function isAuthenticatedMentor(req, res, next) {
		if (!req.user || req.user.role != 'mentor') {
			res.redirect('/')
		} else {
			return next()
		};
	};

	// Checks to see if the user is a successfully authenticated professor.
	function isAuthenticatedProfessor(req, res, next) {
		if (!req.user || req.user.role != 'professor') {
			res.redirect('/')
		} else {
			return next()
		};
	};

};
