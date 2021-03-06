// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Student Schema. This will be the basis of how student data is stored in the db.
var StudentSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    section: {type: String, required: true},
    comfortLevel: {type: Number, required: true},
    subjects: [{type: String, required: true}],
    availability: {type: String, required: true},
    additionalinfo: {type: String},
    matched: {type: Boolean, default: false},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
StudentSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Exports the StudentSchema for use elsewhere. Sets the MongoDB collection to be used as: "students"
module.exports = mongoose.model('Student', StudentSchema);