const { v4: uuidv4 } = require('uuid');
const player = require('../db/models/player');
const officialServer = require('../db/models/official-server');

class Auth {

    /**
     * Async function to determine if a player exists in the database.
     * 
     * @param {*} data The incoming JSON data from the client.
     * @returns True, if the player exists.
     */
    async checkPlayerExists(data) {
        const pl = await player.exists({ PlayerId: data.PlayerId });
        if (pl) {
            return true;
        }
    }
    
    /**
     * Async function to determine is a player's token is valid.
     * 
     * @param {*} data The incoming JSON data from the client.
     * @returns True, if the token is valid and exists for the player.
     */
    async checkPlayerTokenIsValid(data) {
        const pl = await player.exists({ PlayerId: data.PlayerId, Token: data['X-Auth-Token'] });
        if (pl) {
            return true;
        }
    }

    /**
     * Async function to determine is a server's token is valid.
     * 
     * @param {*} data The incoming JSON data from the s&box server.
     * @returns True, if the token exists and is valid for the ServerId.
     */
    async checkServerTokenIsValid(data) {
        const server = await officialServer.exists({ ServerId: data.ServerId, Token: data['X-Auth-Token'] });
        if (server) {
            return true;
        }
    }
    
    /**
     * Synchronous function for generating a new UUIDv4.
     * 
     * @returns A new UUIDv4.
     */
    generateUUID() {
        return uuidv4();
    }
}

module.exports = new Auth();