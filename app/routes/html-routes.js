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
		// Mentor.find({section: req.user.section, approved: null}, function(err, students) {
		// 	if (err) res.send(err);
		// 	res.render('professor', {user: req.user, pendingmentor: students})
		// });
		// res.render('professor', {user: req.user})
		Mentor.find({section: req.user.section}).populate('mentoring').exec(function(err, mentors) {
			if (err) res.send(err);

			var currentMentors = [];
			var pendingMentors = [];
			var deniedMentors = [];

			for (var i = 0; i < mentors.length; i++) {
				if (mentors[i].approved == true) {
					currentMentors.push(mentors[i])
				} else if (mentors[i].approved == false) {
					deniedMentors.push(mentors[i])
				} else {
					pendingMentors.push(mentors[i])
				}
			}

			console.log(mentors)

			res.render('professor', {user: req.user, currentmentors: currentMentors, pendingmentors: pendingMentors, deniedmentors: deniedMentors})
		});
	});

	// Professor account info page.
	app.get('/professor/account', isAuthenticatedProfessor, function(req, res) {
		res.render('professor-account', {user: req.user})
	});

	// Admin Routes.
	// =========================================================

	app.get('/admin', function(req, res){

		Mentor.find(function(err, mentors) {
			if (err) res.send(err);

			var approvedMentors = [];
			var pendingMentors = [];
			var deniedMentors = [];

			for (var i = 0; i < mentors.length; i++) {
				if (mentors[i].approved == true) {
					approvedMentors.push(mentors[i])
				} else if (mentors[i].approved == false) {
					deniedMentors.push(mentors[i])
				} else {
					pendingMentors.push(mentors[i])
				}
			}

			// res.send(mentors);
			res.render('admin', {approvedmentors: approvedMentors, pendingmentors: pendingMentors, deniedmentors: deniedMentors})
		})

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
