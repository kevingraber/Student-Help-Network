// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var mongoose = require('mongoose');
var Student = require('../model/student.js');
var Mentor = require('../model/mentor.js');
var Professor = require('../model/professor.js');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var passport = require('passport');

// Setting up the account that will send the emails.
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'shn.noreply@gmail.com',
		pass: 'rutgers0451'
	}
});


// Routes
// =============================================================
module.exports = function(app){

	// Log in route.
	app.post('/login', passport.authenticate('local', {failureRedirect: '/login',}), function(req, res) {
		res.redirect('/api/mentors/' + req.user.id)
	});

	// Log out route.
	app.get('/logout',
  	function(req, res){
		req.logout();
    	res.redirect('/');
 	});

	// Returns a list of all students.
	app.get('/api/student-list', function(req,res) {

		Student.find({}).sort({date: -1}).exec(function(err, docs){
			if (err) {
	          	res.send(err);
	        } else {
	          	res.json(docs);
	        }
		});

	})

	// Professor Routes
	// =============================================================
	app.get('/api/professor/:id', function(req, res) {
		Student.find({section: req.params.id}, function(err, students) {
			if (err) res.send(err);
			res.json(students);
		})
	})

	app.get('/api/professor/pending/:id', function(req, res) {
		Mentor.find({section: req.params.id, approved: null}, function(err, students) {
			if (err) res.send(err);
			res.json(students);
		})
	})

	app.get('/api/professor/approved/:id', function(req, res) {
		Mentor.find({section: req.params.id, approved: true}, function(err, students) {
			if (err) res.send(err);
			res.json(students);
		})
	})

	// Route for getting information on a student.
	app.get('/api/students/:id', function(req, res) {
		Student.findById(req.params.id, function(err, student) {
			res.json(student);
		})
	})

	// Route for getting the information about a mentor.
	app.get('/api/mentors/:id', function(req, res) {
		Mentor.findById(req.params.id, function(err, mentor) {
			res.json(mentor);
		})
	})

	// Creates a new student.
	app.post('/student-signup', function(req, res){
		console.log(req.body)

		// Creates a new Student based on the Mongoose schema and the post body
        var newStudent = new Student({
            name: req.body.name,
            email: req.body.email,
            section: req.body.section,
            comfortLevel: req.body.comfortLevel,
            subjects: req.body.subjects,
            availability: req.body.availability,
            additionalinfo: req.body.additionalinfo,

        });

        // New Student is saved in the db.
        newStudent.save(function(err){
            if(err) res.send(err);

		Mentor
		  .find({
		  	full: false, 
		  	// availability: req.body.availability, 
		  	subjects: {$in: newStudent.subjects}
		  })
		  // .sort({date: -1})
		  .exec(function(err, docs){

				if (err) {
		          	res.send(err);
		        } else {

		          	if (docs.length != 0) {
		          		// console.log(docs)
		          		res.send(docs)

		          		var bestMatch;
		          		var highestNumber = 0;

		          		for (var i = 0; i < docs.length; i++) {
		          			var subjectsInCommon = _.intersection(newStudent.subjects, docs[i].subjects).length
		          			console.log( "You have " + subjectsInCommon + " subjects in common with " + docs[i].name );
		          			if (subjectsInCommon > highestNumber) {
		          				bestMatch = docs[i];
		          				highestNumber = subjectsInCommon;
		          			}
		          		}

		          		console.log("You have the most subjects in common with: " + bestMatch.name)
		          		console.log("You have " + highestNumber + " subjects in common with " + bestMatch.name)

		          		Mentor.findOneAndUpdate({'_id': bestMatch._id}, {$push:{"mentoring": newStudent._id}})
							.exec(function(err, artdoc){
								if (err){
									console.log(err);
								} else {
									console.log(artdoc);

									Student.findByIdAndUpdate(newStudent._id, { $set: { matched: true }}, function (err, student) {
									  	if (err) return handleError(err);
									  	// res.send(tank);
									});

								}
							});

		          	} else {
		          		// console.log("No matches found :(")
		          		res.send("No Matches found :(")
		          	}
		          	
		        }

			});

            // If no errors are found, it responds with a JSON of the new student
            // res.json(req.body);
        });

		// res.send("Thanks for signing up!")
	});

	// Route for creating a new mentor.
	app.post('/mentor-signup', function(req, res){

		console.log(req.body);

		// Creates a new mentor based on the Mongoose schema and the post body
        var newMentor = new Mentor({
            name: req.body.name,
            email: req.body.email,
            section: req.body.section,
            username: req.body.username,
            password: req.body.password,
            comfortLevel: req.body.comfortLevel,
            subjects: req.body.subjects,
            numCanMentor: req.body.numCanMentor,
            availability: req.body.availability,
        });

        // The new mentor is saved in the db.
       	newMentor.save(function(err){
            if(err) res.send(err);
            res.send("Thank You for signing up!")

            // Finding the professor of the mentor and sending them an email.
            Professor.findOne({section: newMentor.section}, function(err, prof) {
            	if (err) throw err;
            	console.log(prof);
            	console.log("You are in section: " + newMentor.section + ". Your Professor is " + prof.name + ". His email is " + prof.email + ".");

            			// Email options.
						var mailOptions = {
						    from: '"Student Help Network" <shn.noreply@gmail.com>', // sender address
						    // to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
						    to: prof.email,
						    subject: 'New Mentor Request', // Subject line
						    // text: 'One of your students' + newMentor.name + 'is requesting to be a mentor. Log in to accept or deny them.', // plaintext body
						    html: '<p>One of your students ' + newMentor.name + ' is requesting to be a mentor.</p> <p>Log in to accept or deny them.</p> <a href="http://google.com">link will be here!</a>' // html body
						};

						// Send mail with defined transport object.
						transporter.sendMail(mailOptions, function(error, info){
						    if(error){
						        return console.log(error);
						    }
						    console.log('Message sent: ' + info.response);
						    // res.send("Email sent successfully!")
						});
				            })
				        });
	});

	app.post('/api/match-test', function(req, res) {

		// console.log(req.body);
		console.log(req.body.subjects)

		Mentor
		  .find({
		  	full: false, 
		  	// availability: req.body.availability, 
		  	subjects: {$in: req.body.subjects}
		  })
		  // .sort({date: -1})
		  .exec(function(err, docs){

				if (err) {
		          	res.send(err);
		        } else {

		          	if (docs.length != 0) {
		          		// console.log(docs)
		          		res.send(docs)

		          		var bestMatch;
		          		var highestNumber = 0;

		          		for (var i = 0; i < docs.length; i++) {
		          			var subjectsInCommon = _.intersection(req.body.subjects, docs[i].subjects).length
		          			console.log( "You have " + subjectsInCommon + " subjects in common with " + docs[i].name );
		          			if (subjectsInCommon > highestNumber) {
		          				bestMatch = docs[i];
		          				highestNumber = subjectsInCommon;
		          			}
		          		}

		          		console.log("You have the most subjects in common with: " + bestMatch.name)
		          		console.log("You have " + highestNumber + " subjects in common with " + bestMatch.name)

		          	} else {
		          		// console.log("No matches found :(")
		          		res.send("No Matches found :(")
		          	}
		          	
		        }

			});

	});

	app.post('/api/newmatch-test', function(req, res) {

		// console.log(req.body);
		console.log(req.body.subjects)

		var query = Mentor.find({full: false, subjects: {$in: req.body.subjects} });

		Mentor
		  .find({
		  	full: false, 
		  	// availability: req.body.availability, 
		  	subjects: {$in: req.body.subjects}
		  })
		  .exec(function(err, docs){

		  	

				if (err) {
		          	res.send(err);
		        } else {

		          	if (docs.length != 0) {
		          		// console.log(docs)
		          		res.send(docs)

		          		var bestMatch;
		          		var highestNumber = 0;

		          		for (var i = 0; i < docs.length; i++) {
		          			var subjectsInCommon = _.intersection(req.body.subjects, docs[i].subjects).length
		          			console.log( "You have " + subjectsInCommon + " subjects in common with " + docs[i].name );
		          			if (subjectsInCommon > highestNumber) {
		          				bestMatch = docs[i];
		          				highestNumber = subjectsInCommon;
		          			}
		          		}

		          		console.log("You have the most subjects in common with: " + bestMatch.name)
		          		console.log("You have " + highestNumber + " subjects in common with " + bestMatch.name)

		          	} else {
		          		// console.log("No matches found :(")
		          		res.send("No Matches found :(")
		          	}
		          	
		        }

			});

	});

	// Create a new professor.
	app.post('/new-professor', function(req, res) {

		// Creates a new professor based on the Mongoose schema and the post body.
		var newProfessor = new Professor({
            name: req.body.name,
            email: req.body.email,
            section: req.body.section
        });

		// The new professor is saved in the db.
       	newProfessor.save(function(err){
            if(err) res.send(err);
            res.send("Thank You for signing up!");
        });

	});

	app.post('/approve', function(req, res) {

		Mentor.findByIdAndUpdate('57c0a5805d5ae1640f98c784', { $set: { approved: true }}, function(err, mentor) {
			if (err) handleError(err);
			res.send("Mentor Approved!")
		});

	});

	app.post('/email-test', function(req, res) {

		// console.log(req.body)

		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: '"Student Help Network" <shn.noreply@gmail.com>', // sender address
		    // to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
		    to: req.body.address,
		    subject: 'Test!', // Subject line
		    text: 'This is a test!', // plaintext body
		    html: '<b>Hello world 🐴</b>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		    res.send("Email sent successfully!")
		});

	})

}