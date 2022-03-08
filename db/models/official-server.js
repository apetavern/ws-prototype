const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfficialServer = new Schema({
    ServerId: String,
    Name: String,
    Token: String
});

module.exports = mongoose.model('OfficialServer', OfficialServer);