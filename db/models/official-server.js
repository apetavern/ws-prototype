const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OfficialServer = new Schema({
    ServerId: String,
    Name: String,
    Token: String
});

module.exports = mongoose.model('OfficialServer', OfficialServer);