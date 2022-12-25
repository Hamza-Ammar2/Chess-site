const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    player1: {type: String},
    player2: {type: String},
    winner: {type: String},
    draw: {type: Boolean},
    positions: {type: String},
    winningMethod: {type: String},
    mode: {type: String},
    ranked: {type: Boolean}
});

module.exports = mongoose.model('Match', matchSchema);