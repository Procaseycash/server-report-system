require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const AppRoute = require('./routes');
const ApiHandlerService = require( './services/ApiHandlerService');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/jquery', express.static(path.join(__dirname, '../node_modules/jquery/dist/'))); // make jquery available on public client app
app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/'))); // make bootstrap available on public client app
app.use(express.static(path.join(__dirname, '../public')));

AppRoute.init(app); // initialize app routing

const bootstrap = () => {
    try {
        ApiHandlerService.getAccessToken(); // initialize server to generate access token to be used.
    } catch ( e ) {
        console.log(`TOKEN_GENERATION_AT_LAUNCH_FAILED: ${e.message}`);
    }
    return app;
};

module.exports = bootstrap();
