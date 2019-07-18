const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const session = require('express-session');
const dateFormat = require('dateformat');
const dbMysql = require("../db/dbMysql");
var now = new Date();
var localStorage = require('localStorage');
const loginModel = require('../models/login');
const facilityUserModel = require("../models/facilityUser");
const systemSessionModel = require("../models/systemSessionModel");
const helpers = require("../lib/helpers");

// Use session to pass the iss information to the callback
router.use(
    session({
        secret: 'keyboard cat',
        cookie: {
            maxAge: 60000,
        },
        resave: true,
        saveUninitialized: true,
    })
);

router.post('/LoginUser', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return helpers.generateApiResponse(res, 'Please fill all required fields.', 400, []);
    }

    let email = req.body.email;
    let pwd = req.body.password;

    var post = {
        user_email: email,
    };
    
    // Check if user exists or not
    var getUserQuery = loginModel.getUser();
    var [userRow] = await dbMysql.query(getUserQuery, post);
    if (typeof userRow == 'undefined' || userRow.length <= 0) {
        return await helpers.generateApiResponse(res, 'User does not exist.', 404, []);
    }

    if (!bcrypt.compareSync(pwd, userRow[0].user_pwd)) {
        return helpers.generateApiResponse(res, 'Invalid credentials.', 401, []);
    }

    var token = uuidv4();
    req.session.session_token = token;
    req.session.utype = 0;
    var post1 = {
        remember_token: token,
    };
    var post2 = {
        system_user_id: userRow[0].user_id,
        sys_session_id: token,
        session_started_at: dateFormat(now, 'yyyy-mm-dd h:MM:ss'),
        utype: 0,
    };
    // Set Logged in utype  as 1 for Epic User. 0 for Master Admin
    var data = [{
        session_id: token,
        user_id: userRow[0].user_id,
        utype: 0,
        user: userRow[0].user_name,
    }];
    localStorage.setItem('token_id', userRow[0].user_id);
    var updateUserQuery = loginModel.updateUser(userRow[0].user_id);
    var [updateUserRow] = await dbMysql.query(updateUserQuery, post1);
    if (updateUserRow.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Something went wrong in updating user details', 400, []);
    }

    var addSessionQuery = systemSessionModel.insertSystemSession();
    var [addSessionRow] = await dbMysql.query(addSessionQuery, post2);
    if (addSessionRow.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Something went wrong in adding session details.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'Login successful.', 200, data);
});

router.post('/logout', async (req, res) => {
    var id = req.query.user_id;
    // Check for Session entry in DB
    var getSessionByUserIdQuery = systemSessionModel.getSystemSessionByUserId();
    var [userRow] = await dbMysql.execute(getSessionByUserIdQuery, [id]);
    if (typeof userRow == 'undefined' || userRow.length <= 0) {
        return await helpers.generateApiResponse(res, 'Something went wrong in getting user details.', 400, []);
    }

    var userType = userRow[0].utype;
    // Delete Session entry for user
    var post = {
        system_user_id: id,
    };
    var deleteSystemSessionQuery = systemSessionModel.deleteSystemSession();
    var [updateUserRow] = await dbMysql.query(deleteSystemSessionQuery, post);
    if (updateUserRow.affectedRows <= 0) {
        return helpers.generateApiResponse(res, 'Something went wrong in deleting user session details.', 400, []);
    }

    var updateUserToken = '';
    var post1 = {
        remember_token: null,
    };
    // Reset User Remember token for Admin User
    if (userType == 0) {
        updateUserToken = loginModel.updateUser(id);
    }

    // Reset User Remember token for EPIC User
    if (userType == 1) {
        updateUserToken = facilityUserModel.getFacilityUserUpdate(id)
    }

    if (updateUserToken == '') {
        return helpers.generateApiResponse(res, 'Something went wrong in data for updating user details.', 400, []);
    }

    var [updateUserRow] = await dbMysql.query(updateUserToken, post1);
    if (updateUserRow.affectedRows <= 0) {
        return helpers.generateApiResponse(res, 'Something went wrong in updating user details.', 400, []);
    }
    
    return helpers.generateApiResponse(res, 'Logged out successfully', 200, updateUserRow);

});

// Change Master Admin login password
router.post('/change-password', async (req, res) => {
    if (!req.body.userId || !req.body.currentPassword || !req.body.password || !req.body.passwordConfirm) {
        return helpers.generateApiResponse(res, 'Please fill all required fields.', 400, []);
    }

    if (req.body.password !== req.body.passwordConfirm) {
        return helpers.generateApiResponse(res, 'New password & Retyped paassword do not match.', 400, []);
    }

    let userId = req.body.userId;
    let pwd = req.body.currentPassword;
    let newPwd = req.body.password;

    var post = {
        user_id: userId,
    };

    // Check if user exists or not
    var getUserQuery = loginModel.getUser();
    var [userRow] = await dbMysql.query(getUserQuery, post);
    if (typeof userRow == 'undefined' || userRow.length != 1) {
        return await helpers.generateApiResponse(res, 'Invalid User.', 404, []);
    }

    if (!bcrypt.compareSync(pwd, userRow[0].user_pwd)) {
        return helpers.generateApiResponse(res, 'Current password is invalid.', 401, []);
    }

    const saltRounds = 10;
    var hashedPwd = bcrypt.hashSync(newPwd, saltRounds);
    var post1 = {
        user_pwd: hashedPwd,
    };

    var updateUserQuery = loginModel.updateUser(userId);
    var [updateUserRow] = await dbMysql.query(updateUserQuery, post1);
    if (updateUserRow.affectedRows <= 0) {
        return helpers.generateApiResponse(res, 'Something went wrong in updating user details.', 400, []);
    }
    
    return helpers.generateApiResponse(res, 'Password successfully updated.', 200, []);

});

module.exports = router;
