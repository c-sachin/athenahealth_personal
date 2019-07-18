require('dotenv').config();
const session = require('express-session');
const https = require('https');
const fs = require('fs');
const app = require('./app');

// Use session to pass the iss information to the callback
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true,
}));

//Use system configuration for port or use 5000 by default.
const port = process.env.APP_PORT || 443;
const APP_URL = process.env.APP_URL;
const CLIENT_URL = process.env.CLIENT_URL;

// Create server with exported express app
// Set SSL Certificates
const httpsOptions = {
    key: fs.readFileSync('./ssl_cert/key.pem'),
    cert: fs.readFileSync('./ssl_cert/cert.pem')
}
const server = https.createServer(httpsOptions, app);
server.listen(port, function () {
    console.log("\nServer now running on " + APP_URL);
    console.log("\nClient running on " + CLIENT_URL);
});
