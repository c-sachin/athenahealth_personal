require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const auth = require('./api/auth');
const facilityUsers = require('./api/facilityUsers');
const facilities = require('./api/facilities');
const facilityKit = require('./api/facilityKit');
const Login = require('./api/login');
const cookieParser = require('cookie-parser');
const getAppointments = require('./api/getAppointments');
const sendSurvey = require('./api/sendSurvey');

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyparser.json());
app.use(
    bodyparser.urlencoded({
        extended: false,
    })
);

app.use('/', auth);
app.use('/api/facilityUsers', facilityUsers);
app.use('/api/facilities', facilities);
app.use('/api/facilityKit', facilityKit);
app.use('/api/Login', Login);

app.use('/api/getAppointments', getAppointments);
app.use('/api/sendSurvey', sendSurvey);

app.use((req, res, next) => {
    const err = new Error(process.env.ERR_400);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 501);
    res.json({
        error: {
            code: err.status || 501,
            message: err.message,
        },
    });
});

module.exports = app;
