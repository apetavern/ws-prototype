const { v4: uuidv4 } = require('uuid');
const players = require('../db/models/player');

class UUID {

    async checkPlayerExists(data) {
        const player = await players.exists({ PlayerId: data.PlayerId });
        if (player) {
            return true;
        }
        return false;
    }
    
    async checkTokenIsValid(data) {
        const player = await players.exists({ PlayerId: data.PlayerId, Token: data['X-Auth-Token'] });
        if (player) {
            return true;
        }
    }
    
    generateUUID() {
        return uuidv4();
    }
}

module.exports = new UUID();