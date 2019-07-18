require('dotenv').config();
const axios = require('axios');
const https = require('https');
const randomstring = require('randomstring');

var facilityEpicId = randomstring.generate(15);
var facilityUserEpicId = randomstring.generate(15);

const APP_URL = process.env.APP_URL;

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

const index = {
    login: () => {
        var postData = {
            email: 'epic@agora.com',
            password: 'password',
        };
        return instance
            .post(`${APP_URL}api/Login/LoginUser`, postData)
            .then(res => res.data)
            .catch(error => error);
    },

    facilityGet: () => {
        return instance
            .get(`${APP_URL}api/facilities/Facilities`)
            .then(res => res.data)
            .catch(error => error);
    },

    facilityUsers: () => {
        var postData = {
            facility_id: 1,
        };
        return instance
            .post(`${APP_URL}api/facilityUsers/FacilityUsers`, postData)
            .then(res => res)
            .catch(error => error);
    },

    patientScreening: () => {
        return instance
            .post(`${APP_URL}api/patientSearch/patientScreening`)
            .then(res => res)
            .catch(error => error);
    },

    getParametersTableValues: () => {
        postData = {
            parameterTable: 5,
        };
        return instance
            .post(`${APP_URL}api/patientSearch/getParametersTableValues`, postData)
            .then(res => res)
            .catch(error => error);
    },

    patientQueryList: () => {
        postData = {
            parameterTable: 5,
        };
        return instance
            .post(`${APP_URL}api/patientSearch/patientQueryList`, postData)
            .then(res => res)
            .catch(error => error);
    },

    patientDailyQueryList: () => {
        return instance
            .post(`${APP_URL}api/DailyQuery/patientDailyQueryList`)
            .then(res => res)
            .catch(error => error);
    },

    getVariableValues: () => {
        postData = {
            variableType: 5,
        };
        return instance
            .post(`${APP_URL}api/DailyQuery/getVariableValues`, postData)
            .then(res => res)
            .catch(error => error);
    },

    getVariableValuesBaa: () => {
        postData = {
            interventionType: 7,
        };
        return instance
            .post(`${APP_URL}api/before-after-analysis/getVariableValues`, postData)
            .then(res => res)
            .catch(error => error);
    },

    patientBeforeAfterList: () => {
        return instance
            .post(`${APP_URL}api/before-after-analysis/patientBeforeAfterList`)
            .then(res => res)
            .catch(error => error);
    },

    getVariableRange: () => {
        postData = {
            measureType: 4,
        };
        return instance
            .post(`${APP_URL}api/before-after-analysis/getVariableRange`, postData)
            .then(res => res)
            .catch(error => error);
    },
};

module.exports = index;
