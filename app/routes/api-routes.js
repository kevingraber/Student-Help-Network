// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var mongoose = require('mongoose');
var Student = require('../model/student.js');
var Mentor = require('../model/mentor.js');
var _ = require('lodash');


// Routes
// =============================================================
module.exports = function(app){

	// Returns a list of all students.
	app.get('/api/student-list', 
	function(req,res) {

		Student.find({}).sort({date: -1}).exec(function(err, docs){
			if (err) {
	          	res.send(err);
	        } else {
	          	res.json(docs);
	        }
		});

	})

	// Route for getting information on a student.
	app.get('/api/students/:id', 
	function(req, res) {
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
	app.post('/student-signup',
	function(req, res){
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

   //          Mentor.find({full: false, availability: newStudent.availability, subjects: newStudent.subjects}).sort({date: -1}).exec(function(err, docs){

			// 	if (err) {
		 //          	res.send(err);
		 //        } else {

		 //          	if (docs.length != 0) {
		 //          		console.log(docs)
		 //          	} else {
		 //          		console.log("No matches found :(")
		 //          	}
		          	
		 //        }
			// });

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

	// Creates a new mentor.
	app.post('/mentor-signup',
	function(req, res){
		console.log(req.body)

		// Creates a new Playgroup based on the Mongoose schema and the post body
        var newMentor = new Mentor({
            name: req.body.name,
            email: req.body.email,
            section: req.body.section,
            comfortLevel: req.body.comfortLevel,
            subjects: req.body.subjects,
            numCanMentor: req.body.numCanMentor,
            availability: req.body.availability,
        });

        // New Playgroup is saved in the db.
       newMentor.save(function(err){
            if(err) res.send(err);

   //          Student
   //            .find({
   //              matched: false, 
   //              availability: newMentor.availability, 
   //              subjects: {$in: newMentor.subjects}
   //            })
   //            .sort({date: -1})
   //            .exec(function(err, docs){            	
			// 	if (err) {
		 //          	res.send(err);
		 //        } else {
		 //          	if (docs.length != 0) {
		 //          		console.log(docs)
		 //          	} else {
		 //          		console.log("No matches found :(")
		 //          	}      
		 //        }
			// });

            // If no errors are found, it responds with a JSON of the new user
            // res.json(req.body);

            res.send("Thank You for signing up!")
        });
	});

	app.post('/api/match-test',
	function(req, res) {

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

}