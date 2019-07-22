const express = require("express");
const dbMysql = require("../db/dbMysql");
const helpers = require('../lib/helpers');
const router = express.Router();
const appointmentModel = require("../models/appointment");
const facilityKitModel = require("../models/facilityKit");
const axios = require("axios");
const moment = require("moment");

router.get("/send", async (req, res) => {
 
    var body = {
        'campaign_id':99,
        'contact':{
            'email':'sachinc@mailinator.com',
            'first_name':'Kate',
            'last_name':'Bell',
            'attributes':{
                'plan': 'gold',
                'signed_up': '2014-12-12T10:00:00Z'
            }
        },
        'attributes':{
            'OrderId':123456789
        }
    };
    var content = JSON.stringify(body)
 
    axios.post(
        'https://app.promoter.io/api/v2/survey/', 
        content, 
        {
            headers: { 
                'content-type': 'application/json',
                'Authorization': 'Token 775a219e3ab440410b2bbf56dbfa65aa936be878'
            }
        }
    ).then(async function (response) {
        return await helpers.generateApiResponse(res, 'ok', 200, response);
    })
    .catch(async function (error) {
    return await helpers.generateApiResponse(res, 'fail', 400, error);
    });
});

module.exports = router;