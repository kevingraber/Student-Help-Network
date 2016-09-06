// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates a Mentor Schema. This will be the basis of how mentor data is stored in the db.
var MentorSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    section: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    comfortLevel: {type: Number, required: true},
    subjects: [{type: String, required: true}],
    numCanMentor: {type: Number, required: true},
    availability: {type: String, required: true},
    mentoring: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    approved: {type: Boolean, default: null},
    mentorlevel: {type: Number, default: null},
    full: {type: Boolean, default: false},
    role: {type: String, default: 'mentor'},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
MentorSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Exports the MentorSchema for use elsewhere. Sets the MongoDB collection to be used as: "mentors"
module.exports = mongoose.model('Mentor', MentorSchema);