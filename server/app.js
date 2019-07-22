require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const auth = require('./api/auth');
//const solrData = require('./api/solr/SolrData');
const facilityUsers = require('./api/facilityUsers');
const facilities = require('./api/facilities');
const facilityKit = require('./api/facilityKit');
const Login = require('./api/login');
/* const patientSearch = require('./api/patientSearch');
const parameterList = require('./api/parameterList');
const beforeAfterAnalysis = require('./api/beforeAfterAnalysis');
const dailyQuery = require('./api/dailyQuery'); */

const cookieParser = require('cookie-parser');
/* const search = require('./api/searchData');
const chartReview = require('./api/chartReview');
const gender = require('./api/master/gender');
const maritalStatus = require('./api/master/maritalStatus');
const race = require('./api/master/race');
const imaging = require('./api/master/imaging'); */

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
//app.use('/api/search', search);
//app.use('/api/solrData', solrData);
app.use('/api/facilityUsers', facilityUsers);
app.use('/api/facilities', facilities);
app.use('/api/facilityKit', facilityKit);
app.use('/api/Login', Login);
/* app.use('/api/patientSearch', patientSearch);
app.use('/api/parameterlist', parameterList);
app.use('/api/before-after-analysis', beforeAfterAnalysis);
app.use('/api/dailyquery', dailyQuery);
app.use('/api/chartReview', chartReview);

app.use('/api/gender', gender);
app.use('/api/maritalStatus', maritalStatus);
app.use('/api/race', race);
app.use('/api/imaging', imaging); */
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
