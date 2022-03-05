const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Player = new Schema({
    _id: ObjectId,
    PlayerId: String,
    Name: String,
    Token: String
});

module.exports = Player;