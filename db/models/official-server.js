const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OfficialServer = new Schema({
    _id: ObjectId,
    ServerId: String,
    Name: String,
    Token: String
});

module.exports = OfficialServer;