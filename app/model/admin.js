// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates an admin Schema. This will be the basis of how admin data is stored in the db.
var AdminSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'admin'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
AdminSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Exports the adminSchema for use elsewhere. Sets the MongoDB collection to be used as: "admins"
module.exports = mongoose.model('Admin', AdminSchema);