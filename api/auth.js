require('dotenv').config();
const express = require('express');
const session = require('express-session');
const simpleOauthModule = require('simple-oauth2');
const Client = require('../lib/smart_fhir/client');
const dbMysql = require("../db/dbMysql");
const helpers = require("../lib/helpers");
const uuidv4 = require('uuid/v4');
const dateFormat = require('dateformat');
var now = new Date();
var localStorage = require('localStorage');
const router = express.Router();
const facilityModel = require("../models/facility");
const facilityKitModel = require("../models/facilityKit");
const facilityUserModel = require("../models/facilityUser");
const systemSessionModel = require('../models/systemSessionModel');

const APP_URL = process.env.APP_URL;
const CLIENT_URL = process.env.CLIENT_URL;

// Use session to pass the iss information to the callback
router.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true,
}));

router.get('/launch/:facility_app_id', async (req, res) => {
    const facilityAppId = req.params.facility_app_id;

    // Check if facility with facility_app_id exists
    let facilityAppQuery = facilityModel.getFacilityAuth();
    const [facilityRows] = await dbMysql.execute(facilityAppQuery, [facilityAppId]);
    if (typeof facilityRows == 'undefined' || facilityRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Facility not found.', 404, []);
    }

    if (facilityRows[0].m_facility_active != 1) {
        return await helpers.generateApiResponse(res, 'Error: Facility is inactive.', 403, []);
    }

    const facilityId = facilityRows[0].m_facility_id;

    // Get Facility KIT credentials
    let facilityKitQuery = facilityKitModel.checkFacilityKit(facilityId);
    const [facilityCredentialsRows] = await dbMysql.execute(facilityKitQuery, [facilityId]);
    if (typeof facilityCredentialsRows == 'undefined' || facilityCredentialsRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: KIT access credentials not found.', 404, []);
    }

    const kitServer = facilityCredentialsRows[0].facility_kit_server;
    const kitPort = facilityCredentialsRows[0].facility_kit_port;
    const kitUsername = facilityCredentialsRows[0].facility_kit_userid;
    const kitPassword = facilityCredentialsRows[0].facility_kit_password;
    const facilityClientId = facilityCredentialsRows[0].facility_fhir_id;
    const facilityClientSecret = facilityCredentialsRows[0].facility_fhir_secret;

    if (kitServer == '' || kitPort == '' || kitUsername == '' || kitPassword == '' || facilityClientId == '' || facilityClientSecret == '') {
        return await helpers.generateApiResponse(res, 'Error: Some of the KIT access credentials are missing.', 404, []);
    }

    const {
        iss,
        launch
    } = req.query;

    const fhirClient = new Client({
        baseUrl: iss
    });

    const {
        authorizeUrl,
        tokenUrl
    } = await fhirClient.smartAuthMetadata();

    req.session.iss = iss;
    req.session.facilityAppId = facilityAppId;
    localStorage.setItem('iss', iss);
    localStorage.setItem('facilityAppId', facilityAppId);

    // Create a new oAuth2 object using the Client capability statement:
    const oauth2 = simpleOauthModule.create({
        client: {
            id: facilityClientId,
            secret: facilityClientSecret,
        },
        auth: {
            tokenHost: `${tokenUrl.protocol}//${tokenUrl.host}`,
            tokenPath: tokenUrl.pathname,
            authorizeHost: `${authorizeUrl.protocol}//${authorizeUrl.host}`,
            authorizePath: authorizeUrl.pathname,
        },
        options: {
            authorizationMethod: 'body',
        },
    });

    // Authorization uri definition
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
        redirect_uri: APP_URL + 'callback',
        launch,
        aud: iss,
        scope: 'launch openid profile user/Patient.read',
        state: '3(#0/!~',
    });
    await res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', async (req, res) => {
    const {
    } = req.session;
    const iss = localStorage.getItem('iss');
    const facilityAppId = localStorage.getItem('facilityAppId');
    
    // Check if facility with facility_app_id exists
    let facilityAppQuery = facilityModel.getFacilityAuth();
    const [facilityRows] = await dbMysql.execute(facilityAppQuery, [facilityAppId]);
    if (typeof facilityRows == 'undefined' || facilityRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Facility not found.', 404, []);
    }

    if (facilityRows[0].m_facility_active != 1) {
        return await helpers.generateApiResponse(res, 'Error: Facility is inactive.', 403, []);
    }

    const facilityId = facilityRows[0].m_facility_id;

    // Get Facility KIT credentials
    let facilityKitQuery = facilityKitModel.checkFacilityKit(facilityId);
    const [facilityCredentialsRows] = await dbMysql.execute(facilityKitQuery, [facilityId]);
    if (typeof facilityCredentialsRows == 'undefined' || facilityCredentialsRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: KIT access credentials not found.', 404, []);
    }

    const kitServer = facilityCredentialsRows[0].facility_kit_server;
    const kitPort = facilityCredentialsRows[0].facility_kit_port;
    const kitUsername = facilityCredentialsRows[0].facility_kit_userid;
    const kitPassword = facilityCredentialsRows[0].facility_kit_password;
    const facilityClientId = facilityCredentialsRows[0].facility_fhir_id;
    const facilityClientSecret = facilityCredentialsRows[0].facility_fhir_secret;

    if (kitServer == '' || kitPort == '' || kitUsername == '' || kitPassword == '' || facilityClientId == '' || facilityClientSecret == '') {
        return await helpers.generateApiResponse(res, 'Error: Some of the KIT access credentials are missing.', 404, []);
    }

    const fhirClient = new Client({
        baseUrl: iss
    });
    const {
        authorizeUrl,
        tokenUrl
    } = await fhirClient.smartAuthMetadata();

    // Create a new oAuth2 object using the Client capability statement:
    const oauth2 = simpleOauthModule.create({
        client: {
            id: facilityClientId,
            secret: facilityClientSecret,
        },
        auth: {
            tokenHost: `${tokenUrl.protocol}//${tokenUrl.host}`,
            tokenPath: tokenUrl.pathname,
            authorizeHost: `${authorizeUrl.protocol}//${authorizeUrl.host}`,
            authorizePath: authorizeUrl.pathname,
        },
        options: {
            authorizationMethod: 'body',
        },
    });

    const {
        code
    } = req.query;
    const options = {
        code,
        redirect_uri: APP_URL + 'callback',
    };

    try {
        const result = await oauth2.authorizationCode.getToken(options);
        const {
            token
        } = oauth2.accessToken.create(result);
        const epicUserId = token.EPIC_User_Id;
        const accessToken = token.access_token;
        const refreshToken = token.refresh_token;

        // Get facility epic user details
        let epicUserQuery = facilityUserModel.facilityEpicUser();
        const [facilityEpicUserRows] = await dbMysql.execute(epicUserQuery, [epicUserId]);
        if (typeof facilityEpicUserRows == 'undefined' || facilityEpicUserRows.length <= 0) {
            return await helpers.generateApiResponse(res, 'Error: User not found.', 404, []);
        }

        if (facilityEpicUserRows[0].m_facility_user_active != 1) {
            return await helpers.generateApiResponse(res, 'Error: User is inactive.', 403, []);
        }

        if (facilityEpicUserRows[0].f_facility_id != facilityId) {
            return await helpers.generateApiResponse(res, 'Error: User does not belong to this facility.', 404, []);
        }

        fhirClient.bearerToken = token.access_token;

        var sysSessionId = uuidv4();
        var ehr_id = epicUserId;
        var systemUserId = facilityEpicUserRows[0].m_facility_user_id;
        var sessionExpiresIn = token.expires_in;
        var sessionExpiresAt = new Date(now);
        sessionExpiresAt.setSeconds(now.getSeconds() + sessionExpiresIn);
        req.session.session_token = sysSessionId;
        req.session.utype = 1;  // Set Logged in utype as 1 for Epic User. 0 for Master Admin

        var post = {
            ehr_id: ehr_id,
            system_user_id: systemUserId,
            access_token: accessToken,
            refresh_token: refreshToken,
            sys_session_id: sysSessionId,
            session_started_at: dateFormat(now, "yyyy-mm-dd H:MM:ss"),
            session_expires_in: sessionExpiresIn,
            session_expires_at: dateFormat(sessionExpiresAt, "yyyy-mm-dd H:MM:ss"),
            utype: 1
        }

        var systemSessionInsertQuery = systemSessionModel.insertSystemSession();
        var [systemSessionRows] = await dbMysql.query(systemSessionInsertQuery, post);
        if (systemSessionRows.affectedRows <= 0) {
            return await helpers.generateApiResponse(res, 'Something went wrong in updating system session details.', 400, []);
        }

        var post1 = {
            remember_token: sysSessionId
        };

        var facilityUserUpdateByUidQuery = facilityUserModel.updateFacilityUserByUserId(systemUserId);
        var [facilityEpicUserUpdateRow] = await dbMysql.query(facilityUserUpdateByUidQuery, post1);
        if (facilityEpicUserUpdateRow.affectedRows <= 0) {
            return await helpers.generateApiResponse(res, 'Something went wrong in updating facility epic user details details.', 400, []);
        }

        var redirect_after_auth = CLIENT_URL + 'PatientScreening?facility_id=' + facilityAppId + '&epic_user_id=' + epicUserId + '&token=' + sysSessionId;

        res.cookie('epic_id', epicUserId);
        res.cookie('facilityAppId', facilityAppId);
        res.cookie('token', sysSessionId);
        res.cookie('token_id', systemUserId);
        res.cookie('utype', 1);
        localStorage.setItem('epic_id', epicUserId);
        localStorage.setItem('facilityAppId', facilityAppId);
        localStorage.setItem('token', sysSessionId);
        localStorage.setItem('token_id', systemUserId);
        localStorage.setItem('utype', 1);
        await res.redirect(redirect_after_auth);
    } catch (error) {
        return await helpers.generateApiResponse(res, `${error.message}|Error: Authentication failed.`, 401, []);
    }
});

module.exports = router;