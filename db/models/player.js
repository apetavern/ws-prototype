const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Player = new Schema({
    PlayerId: String,
    Name: String,
    Token: String
});

module.exports = mongoose.model('Player', Player);