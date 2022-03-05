# ws-prototype
This app is a work-in-progress prototype for a backend for our s&box games.

### Goals
- Fully-fledged WebSocket server with token-based client auth.
- MongoDB database for persistent storage.
- HTTP Server with Steam OAuth2.0 login for managing/refreshing tokens.
- Integrated with a s&box game.

And a little later:
- Shop/payment system, payment processing. Purchases are updated in game in real-time using pub/sub.