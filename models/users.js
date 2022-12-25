const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    rank: {type: Number},
    matches: [{type: Schema.Types.ObjectId, ref:'Match'}]
});

module.exports = mongoose.model('User', userSchema);