require('dotenv').config()

// Dependencies
const mongoose = require('mongoose');
const WebSocket = require('ws');

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

        if (data['X-Auth-Token'] === "valid-token") {
            socket.authorized = true;
        }

        authorizedSockets = sockets.filter(s => s.authorized === true);
        authorizedSockets.forEach(s => s.send(data.Message));
    });

    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});

// Configure MongoDB Connection
await mongoose.connect(process.env.MONGO_URI_STRING)

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
 *      database token for the associated user.
 *   2) If no PlayerId exists, generate a token, send it to the client, and the s&box client will write it to file for them.
 *      When the user leaves and rejoins, the token should be retained, and automatically populate in their requests.
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