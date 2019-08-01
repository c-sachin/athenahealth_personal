require('dotenv').config({path: 'E:/athenahealth/server/.env'})
const dbMysql = require("../db/dbMysql")
const axios = require("axios")
const moment = require("moment")
var querystring = require('querystring')
var version = 'preview1';

main();

async function main() {
    var yesterday = moment().subtract(1, 'days');
    yesterday = yesterday.format("MM/DD/YYYY");
    sql = 'SELECT * FROM m_facility_settings where facility_is_deleted = 0';
    var [facilityRows] = await dbMysql.execute(sql);

    for (var i = 0; i < facilityRows.length; i++) {
        console.log('f_facility_id-->',facilityRows[i]['f_facility_id']);
        var f_facility_id = facilityRows[i]['f_facility_id'];
        var facility_practice_id = facilityRows[i]['facility_practice_id'];
        var facility_fhir_id = facilityRows[i]['facility_fhir_id'];
        var facility_fhir_secret = facilityRows[i]['facility_fhir_secret'];

        var facilityDeptQuery = 'SELECT * from  m_department where f_facility_id = ' + f_facility_id
        var [facilityDeptRows] = await dbMysql.execute(facilityDeptQuery);

        var facility_department_id = '';

        for(var j = 0; j < facilityDeptRows.length; j++){
            if(facilityDeptRows.length > 1){
                facility_department_id += facilityDeptRows[j]['departmentid']+',';
            }else{
                facility_department_id = facilityDeptRows[j]['departmentid'];
            }
        }

        facility_department_id = facility_department_id.replace(/,\s*$/, "");
        console.log('department-->',facility_department_id);
        
        var token = await authentication(facility_fhir_id,facility_fhir_secret);
        console.log('token-->',token);
        if (typeof token !== 'undefined' && token.length > 0 && facility_department_id.length > 0) {
            await appointments(token, facility_department_id, facility_practice_id, f_facility_id);
        }else{
            console.log('Client ID or Secret ID or department ID not found.');
        }
    }
    await process.exit(0);
}

async function authentication(facility_fhir_id,facility_fhir_secret) {
    var keySecret = Buffer.from(facility_fhir_id+":"+facility_fhir_secret).toString('base64');
    var auth = 'Basic '+keySecret;

    var apiUrl = 'https://api.athenahealth.com/oauthpreview/token';
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth
    }
    var config = {
        headers:headers
    }

    var body = querystring.stringify({grant_type: 'client_credentials'})
        
    var { data } = await axios.post(apiUrl, body, config);
    return await data.access_token;
}

async function appointments(token, facility_department_id, facility_practice_id, f_facility_id) {
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

    var auth = 'Bearer '+token;
    var apiUrl = 'https://api.athenahealth.com/'+version+'/'+facility_practice_id+'/appointments/booked/multipledepartment'+query;
    var headers = {'Authorization':auth}
    var config = {
        headers:headers
    }

    var { data } = await axios.get(apiUrl,config);
    
    var appointmentsArr = data.appointments;

    if (typeof appointmentsArr == 'undefined' || appointmentsArr.length <= 0) {
        console.log('Error---->:',data.detailedmessage);
        return 0;
    }
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
            appointment_date: moment(appointmentsArr[i].date,'YYYY-MM-DD'),
            
            appointment_encounter_id:appointmentsArr[i].encounterid,
            appointment_type:appointmentsArr[i].appointmenttype,
            appointment_starttime:appointmentsArr[i].starttime
        }
        await insertAppointmentData(post);
    } 
    return 1;
}

async function insertAppointmentData(post){
    var insertAppointmentQuery = 'INSERT INTO m_appointment SET ?';
    var [appointmentQueryInsert] = await dbMysql.query(insertAppointmentQuery, post);
    console.log('inserted Successfully:')
}