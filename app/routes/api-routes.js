// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var mongoose = require('mongoose');
var Student = require('../model/student.js');
var Mentor = require('../model/mentor.js');


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

            Mentor.find({full: false, availability: newStudent.availability, subjects: newStudent.subjects}).sort({date: -1}).exec(function(err, docs){

				if (err) {
		          	res.send(err);
		        } else {

		          	if (docs.length != 0) {
		          		console.log(docs)
		          	} else {
		          		console.log("No matches found :(")
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

            Student
              .find({
                matched: false, 
                availability: newMentor.availability, 
                subjects: {$in: newMentor.subjects}
              })
              .sort({date: -1})
              .exec(function(err, docs){            	
				if (err) {
		          	res.send(err);
		        } else {
		          	if (docs.length != 0) {
		          		console.log(docs)
		          	} else {
		          		console.log("No matches found :(")
		          	}      
		        }
			});

            // If no errors are found, it responds with a JSON of the new user
            // res.json(req.body);
        });
	});

}