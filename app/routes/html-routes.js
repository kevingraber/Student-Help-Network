// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require('path');

// Routes
// =============================================================
module.exports = function(app){

	app.get('/',
	function(req, res){
		res.sendFile(path.join(__dirname+'/../public/student.html'));
	});

	app.get('/admin',
	function(req, res){
		res.sendFile(path.join(__dirname+'/../public/admin.html'));
	});

}
