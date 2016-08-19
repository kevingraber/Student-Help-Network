// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var mongoose = require('mongoose');
var Student = require('../model/student.js');


// Routes
// =============================================================
module.exports = function(app){

	app.get('/api/student-list', 
	function(req,res) {

		Student.find({}).sort({date: -1}).exec(function(err, docs){
			if (err) {
	          	res.send(err);
	        } else {
	          	res.json(docs);
	          	// console.log(docs)
	        }
		});

	})

	app.post('/student-signup',
	function(req, res){
		console.log(req.body)

		// Creates a new Playgroup based on the Mongoose schema and the post body
        var newStudent = new Student({
            name: req.body.name,
            email: req.body.email,
            section: req.body.section,
            comfortLevel: req.body.comfortLevel,
            subjects: req.body.subjects,
            availability: req.body.availability,
            additionalinfo: req.body.additionalinfo,

        });

        // New Playgroup is saved in the db.
       newStudent.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });

		// res.send("Thanks for signing up!")
	});

}