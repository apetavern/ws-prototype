require('dotenv').config()

// Dependencies
const mongoose = require('mongoose');
const WebSocket = require('ws');

const uuid = require('./security/uuid');

const Player = require('./db/models/player');

// Configure MongoDB Connection
initializeMongo().catch(err => console.log(err));

async function initializeMongo() {
    await mongoose.connect(process.env.MONGO_URI_STRING)
}

// Configure WebSocket Server
const server = new WebSocket.Server({
    port: 8080
})

let sockets = [];
server.on('connection', function(socket) {
    sockets.push(socket);


    socket.on('message', function(msg) {
        data = JSON.parse(msg)
        console.log(data);

        if (data.MessageType === 0) {
            handleAuth(data, socket)
            .then((response) => {
                if (response !== undefined) {
                    socket.send(JSON.stringify(response));
                }
            })
            .catch((err) => {
                console.log(err);
            });
        } else if (data.MessageType === 1) {
            if (socket.authorized) {
                const requestedResource = data.Message;
                console.log(requestedResource);
            } else {
                const response = {};
                response.MessageType = 1;
                response.Message = "You are not authorized. Resource request failed.";
                socket.send(JSON.stringify(response));
            }
        }
    });

    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});

async function handleAuth(data, socket) {
    const playerExists = await uuid.checkPlayerExists(data);

    const token = data['X-Auth-Token'];
    const response = {};
    if (token === 'NO_TOKEN') {
        if (playerExists) {
            // No token, player exists. Player likely lost their token.
            response.MessageType = 1;
            response.Message = "Your PlayerId exists in our database, but your token is missing. Please contact an administrator for more help.";
            socket.authorized = false;
            return response;
        } else {
            // No token, player does not exist. Player likely has never attempted to connect before.
            const playerToken = uuid.generateUUID();

            const player = new Player({
                PlayerId: data.PlayerId,
                Name: data.PlayerName,
                Token: playerToken
            });
            player.save();

            response.MessageType = 0;
            response.Message = playerToken;
            socket.authorized = true;
            return response;
        }
    } else {
        if (playerExists) {
            const tokenIsValid = await uuid.checkTokenIsValid(data);
            if (tokenIsValid) {
                // Token exists, player exists. Player is valid and is authorized.
                response.MessageType = 1;
                response.Message = "Your token has been authenticated. You are authorized!";
                socket.authorized = true;
                return response;
            }
        } else {
            socket.authorized = false;
        }
    }
}

/**
 * Currently, the server can check a token, and perform actions based on whether the socket is authorized to do so.
 * Expand on this by:
 *   1) Writing some database schema that designates Official Servers and their respective tokens.
 *   2) Upon a request, perform actions for a specific server based on the request's token.
 * This will prevent unofficial servers for a particular game from communicating with the WS Server to our liking.
 * 
 * The token should be stored in the data(?) folder of a dedicated server. Perhaps an API that allows token generation
 * for dedicated servers would be fun to try.
 * 
 * For client authentication:
 *   1) When a new client connects, check database for PlayerId. If it exists, check if request token matches the
 *      database token for the associated user. (done)
 *   2) If no PlayerId exists, generate a token, send it to the client, and the s&box client will write it to file for them.
 *      When the user leaves and rejoins, the token should be retained, and automatically populate in their requests. (done)
 *   3) If a player loses their token, allow them to sign into our app with Steam OAuth2.0 to retrieve it. Maybe add a client
 *      command to populate this in game for them?
 *   x) In the future, the process will be drastically simplified with s&box's JWT implementation.
 * 
 * For client safeguarding:
 *   1) The s&box server will send a list of active PlayerIds to this WS Server. If the PlayerId is not actively playing, do not
 *      accept requests from them.
 *   2) Ensure actions clients can send to the WS Server are limited in scope, and rate-limited as well. Ideally, all pertinent info
 *      should come from the authorized server anyway.
 *   x) Should we even allow clients to connect? Is there a point?
 */