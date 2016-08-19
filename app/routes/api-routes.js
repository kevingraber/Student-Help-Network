// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================


// Routes
// =============================================================
module.exports = function(app){

	app.post('/student-signup',
	function(req, res){
		console.log(req.body)
		res.send("Thanks for signing up!")
	});

}