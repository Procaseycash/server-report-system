## Service Report System
This application uses `express-generator` to scaffold the application structure which was later modified.

![Alt text](public/images/dashboard.png?raw=true "server-report-system")

#### Sample View Detail Click from table in a report with `nodes[0].checks`

![Alt text](public/images/node_checks.png?raw=true "server-report-system")

### Setup and Running of the app
All that is needed to be done is:

```
$ npm install
$ npm run start
```

### Access the App launch
Visit http://localhost:3001/ to see the app.

### Libraries
All library usage can be found in `package.json`

### Client App
The client app is a static html files for interfacing with the Proxy APIs created on the server side. The structure of the client app is as follows:
```
public/
    configs/
    css/
    images/
    services/
        /apis/
    utils/    
    app.js
    index.html
```

### Server Side
This is where the backend system is created to interface with the client. The structure of the server side is as follows:
```
server/
    bin/
    configs/
    controllers/
    dtos/
    routes/
    services/
        /apis/
    utils/
    server.js
```

## Proxy APIs
The access token service is called internally when app initializes or when other proxy APIs are called for which token is yet to be generated.
 
    1. http://localhost:3001/api/v1/reports
    2. http://localhost:3001/api/v1/reports/:id/status
    
### Environment
Made use of environment system called `.env` to handle some global configuration for the server side through the `dotenv` library.

### Choice of setup
    1. Favoured application decoupling.
    2. Easy to manage, maintainability and ease for new developer to join with less work through.
    3. Applied MVC pattern
    4. Stay true to SOLID, KISS and DRY principles.
    5. Service based approach is used to make sure segragation of concerns are met.
  
    
### Choice on Storage for AccessToken
The use of file system is employed to avoid too many setup for in-memory cache like `redis` and the token stored in `configs/secrets.json` so that we can retrieve whenever it is needed to make other requests.
We check token expiration at every request made from the `json` stored and once the token expires, a call is made to refresh the token and we store the new token before we proceed to perform the actual request. The storing of the refreshed token is asynchronous to avoid delay in API request cycle.     


### Choice of Chart Library
This chat library ( https://www.chartjs.org/) make it easy to understand their documentation and likewise the repo is continuously been managed. Data manipulation concept is quiet simple and it is straight to implementation which makes it easy for me to work with. It also support variety of choice of charts and likewise lightweight.
