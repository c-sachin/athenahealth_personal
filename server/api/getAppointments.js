const express = require("express");
const dbMysql = require("../db/dbMysql");
const helpers = require('../lib/helpers');
const router = express.Router();
const appointmentModel = require("../models/appointment");
const facilityKitModel = require("../models/facilityKit");
const departmentModel = require("../models/department");
const axios = require("axios");
const moment = require("moment");

router.get("/get", async (req, res) => {
//var yesterday = new Date(); // Today!
//yesterday.setDate(yesterday.getDate() - 1); // Yesterday!
var yesterday = moment().subtract(1, 'days');
yesterday = yesterday.format("MM/DD/YYYY");
//return await helpers.generateApiResponse(res, 'Success: Test success.', 200, yesterday);

var facilityQuery = facilityKitModel.getFacilityKit(0, 0);
var [facilityRows] = await dbMysql.execute(facilityQuery);

var f_facility_id = facilityRows[0]['f_facility_id'];

var facilityDeptQuery = departmentModel.facilityDepartment(f_facility_id);
var [facilityDeptRows] = await dbMysql.execute(facilityDeptQuery);
var facility_department_id = '';
for(var i = 0; i < facilityDeptRows.length; i++){
	if(facilityDeptRows.length > 1){
		facility_department_id += facilityDeptRows[i]['departmentid']+',';
	}else{
		facility_department_id = facilityDeptRows[0]['departmentid'];
	}
}

facility_department_id = facility_department_id.replace(/,\s*$/, "");

console.log('department-->',facility_department_id);

var facility_practice_id = facilityRows[0]['facility_practice_id'];
// var facility_department_id = facilityRows[0]['facility_department_id'];
var facility_fhir_id = facilityRows[0]['facility_fhir_id'];
var facility_fhir_secret = facilityRows[0]['facility_fhir_secret'];
var version = 'preview1';

var events = require('events') 
var https = require('https')
var querystring = require('querystring')

var key = facility_fhir_id
var secret = facility_fhir_secret
var practiceid = facility_practice_id

var auth_prefixes = {
	v1: '/oauth',
	preview1: '/oauthpreview',
	openpreview1: '/oauthopenpreview',
}

// This is a useful function to have
function path_join() {
	// trim slashes from arguments, prefix a slash to the beginning of each, re-join (ignores empty parameters)
	var args = Array.prototype.slice.call(arguments, 0)
	var nonempty = args.filter(function(arg, idx, arr) {
		return typeof(arg) != 'undefined'
	})
	var trimmed = nonempty.map(function(arg, idx, arr) {
		return '/' + String(arg).replace(new RegExp('^/+|/+$'), '')
	})
	return trimmed.join('')
}

// Since we want these functions to run in a set order, we need a way to signal for the next one.
var signal = new events.EventEmitter

// We need to save the token in an outer scope, because of callbacks.
var token

function authentication() {
	var req = https.request({
		// Set up the request, making sure the content-type header is set. Let the https library do
		// the auth header (including base64 encoding) for us.
		hostname: 'api.athenahealth.com',
		method: 'POST',
		path: path_join(auth_prefixes[version], '/token'),
		auth: key + ':' + secret,
		headers: {'content-type': 'application/x-www-form-urlencoded'},
	}, function(response) {
		response.setEncoding('utf8')
		var content = ''
		response.on('data', function(chunk) {
			content += chunk
		})
		response.on('end', function() {
			var authorization = JSON.parse(content)
			// Save the token!
			token = authorization.access_token
			console.log('token--->',token)
			signal.emit('next')
		})
	})

	req.on('error', function(e) {
		console.log(e.message)
	})

	// The one parameter required for OAuth
	req.write(querystring.stringify({grant_type: 'client_credentials'}))
	req.end()
}

function appointments() {
	// Create and encode parameters
	var parameters = {
        appointmentstatus: 2,
        departmentid: facility_department_id,
        startdate: '03/01/2018',
        enddate: '03/01/2018',
        showpatientdetail: true,
        ignorerestrictions:false,
        showcancelled:false,
        showclaimdetail:false,
        showcopay:false,
        showexpectedprocedurecodes:false,
        showinsurance:false,
        showremindercalldetail:false
	}
	var query = '?' + querystring.stringify(parameters)

	var req = https.request({
		hostname: 'api.athenahealth.com',
        method: 'GET',
        path: '/'+version+'/'+practiceid+'/appointments/booked/multipledepartment'+query,
		// We set the auth header ourselves this time, because we have a token now.
		headers: {'authorization': 'Bearer ' + token},
	}, function(response) {
		response.setEncoding('utf8')
		var content = ''
		response.on('data', function(chunk) {
			content += chunk
		}) 
		response.on('end', function() {
            console.log('appointments---->:')
            console.log(JSON.parse(content))
            var arr = JSON.parse(content)
			if (typeof arr['appointments'] == 'undefined' || arr['appointments'].length <= 0) {
				console.log('Error---->:',arr['detailedmessage']);
				return;
			}
            var appointmentsArr = arr['appointments']
            for(var i = 0; i < appointmentsArr.length; i++)
            {
                var post = {
                    f_facility_id:f_facility_id,
                    practice_id:facility_practice_id,
                    patient_id:Number(appointmentsArr[i].patientid),
                    patient_fname:appointmentsArr[i].patient['firstname'],
                    departmentid:appointmentsArr[i].patient['departmentid'],
                    patient_lname:appointmentsArr[i].patient['lastname'],
                    patient_email:appointmentsArr[i].patient['email'],
                    patient_mobileno:appointmentsArr[i].patient['mobilephone'],
                    patient_homephone:appointmentsArr[i].patient['homephone'],
                    patient_address1:appointmentsArr[i].patient['address1'],
                    patient_city:appointmentsArr[i].patient['city'],
                    patient_zip:appointmentsArr[i].patient['zip'],
                    patient_sex:appointmentsArr[i].patient['sex'],
                    patient_state:appointmentsArr[i].patient['state'],
                    patient_country:appointmentsArr[i].patient['countrycode'],
                    appointmentid:appointmentsArr[i].appointmentid,
                    //appointment_date: appointmentsArr[i].date,
                    appointment_date: moment(appointmentsArr[i].date).format('YYYY-MM-DD'),
					
                    appointment_encounter_id:appointmentsArr[i].encounterid,
                    appointment_type:appointmentsArr[i].appointmenttype,
                    appointment_starttime:appointmentsArr[i].starttime
                }
                insertAppointmentData(post);
				console.log('inserted Successfully:')
            }  
        })
	})
	req.on('error', function(e) {
		console.log(e.message)
	})
	req.end()
}

async function insertAppointmentData(post){
    var insertAppointmentQuery = appointmentModel.insertAppointment();
    var [appointmentQueryInsert] = await dbMysql.query(insertAppointmentQuery, post);
}

async function endCall(){
	return await helpers.generateApiResponse(res, 'Appointments updated successfully.', 200,[]);
}

// This is one way of forcing the call order
function main() {
	var calls = [authentication, appointments, endCall]
	signal.on('next', function() {
		var nextCall = calls.shift()
		if (nextCall) {
			nextCall()
		}
	})
	signal.emit('next')
}

main()

});

module.exports = router;