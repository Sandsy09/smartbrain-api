const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        requires: true,
        unique: true
    },
    name: {
        type: String,
        requires: true
    },
    entries: {
        type: Number,
        default: 0
    },
    joined: {
        type: Date,
        default: Date.now
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

