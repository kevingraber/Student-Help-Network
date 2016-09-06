// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Mentor Schema. This will be the basis of how mentor data is stored in the db.
var CollegeSchema = new Schema({
    name: {type: String, required: true},
    sections: [{type: String, required: true}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
CollegeSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Exports the MentorSchema for use elsewhere. Sets the MongoDB collection to be used as: "mentors"
module.exports = mongoose.model('College', CollegeSchema);