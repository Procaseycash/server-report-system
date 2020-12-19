##Report System
This application uses `express-generator` to scaffold the application structure which was later modified.

###Setup and Running of the app
All that is needed to be done is:

```
$ npm install
$ npm run start
```

###Access the App launch
Visit http://localhost:30001/ to see the app.

###Libraries
All library usage can be found in `package.json`

###Client App
The client app is a static html files for interfacing with the middleware APIs created on the server side. The structure of the client app is as follows:
```
public/
    configs/
    css/
    images/
    services/
        apis/
    app.js
    index.html
```

###Server Side
This is where the backend system is created to interface with the client. The structure of the server side is as follows:
```
server/
    bin/
    configs/
    controllers/
    dtos/
    routes/
    services/
        apis/
    utils/
    server.js/
```

###Environment
Made use of environment system called `.env` to handle some global configuration for the server side through the `dotenv` library.

###Choice of setup
    1. Favoured application decoupling.
    2. Easy to manage, maintainability and ease for new developer to join with less work through.
    3. Applied MVC pattern
    4. Stay through to SOLID, KISS and DRY principles.
  
    
### Choice on Storage for AccessToken
The use file system to avoid too many setup for in-memory cache like `redis` and store the token in `configs/secrets.json` then we can retrieve whenever it is needed to make other request.
We check token expiration at every request made from the `json` stored and whenever token expires, Call is made to refresh for a new token and we store before we proceed to perform the actual request. The storing of the refresh token is asynchronous to avoid delay in API request cycle.     