const arrayFunctions = require('../lib/arrayFunctions')
var helpers = {
    /**
     * Generate Solr query for patient search query.
     * 
     * @param {string} tableValue Search variable name for patient demographics. Default is Age
     * @param {string} subTableValue Parameter name for selected variable name for patient demographics. Default is greater than
     * @param {string} dataValue Patient Age value. Default is 0
     * 
     * @returns {string} Solr query for patient search query.
     */
    'patientDemographicSolr': function (tableValue = 'Age', subTableValue = 'greater than', dataValue = '0') {
        var subCondtn = '*:*';
        if (tableValue == "Age") {
            subCondtn = "Patient_Age:[0 TO * ]";
            if (subTableValue == "between") {
                resultValue = dataValue.split("-");
                subCondtn = ' Patient_Age:[' + resultValue[0] + ' TO ' + resultValue[1] + ']';
            }
            if (subTableValue == "less than") {
                subCondtn = "Patient_Age:[* TO " + dataValue + "]";
            }
            if (subTableValue == "greater than") {
                subCondtn = "Patient_Age:[" + dataValue + " TO * ]";
            }
        }
        if (tableValue == "Sex") {
            subCondtn = "Patient_Gender:" + subTableValue;
        }
        if (tableValue == "Race") {
            subCondtn = "Patient_Race:" + subTableValue;
        }
        if (tableValue == "Marital Status") {
            subCondtn = "Patient_Marital_Status:" + subTableValue;
        }
        return subCondtn;
    },
    /**
     * Generate Solr query for patient daily query.
     * 
     * @param {number} pdqcVariableId Variable type.
     * @param {string} pdqcVariableOptionSelected Selected variable option.
     * @param {string} pdqcVariableValueSeleted Selected variable value.
     * @param {number} pdqcFrequency PDQ frequency.
     * 
     * @returns Solr query for patient daily query.
     */
    'getSolrText': function (pdqcVariableId, pdqcVariableOptionSelected, pdqcVariableValueSeleted, pdqcFrequency) {
        var solrQueryTxt = '';
        var admissionText = '';
        let dateValue = '2025-12-31T00:00:00Z';
        var frequency = `[${dateValue}-36500DAYS TO ${dateValue}]`;
        // TODO: frequency will change acc. to PDQ frequency selected from dropdown
        if (pdqcFrequency == "1" || pdqcFrequency == "2" || pdqcFrequency == "3") {
            frequency = `[${dateValue}-36500DAYS TO ${dateValue}]`;
        }

        if (pdqcVariableId == "1") {
            // Lab
            let pdqcVariableOptionSelectedtxt = pdqcVariableOptionSelected.split("|");
            solrQueryTxt = 'LabComponent_Name:"' + pdqcVariableOptionSelectedtxt[0] + '" AND Created_on:' + frequency + ' AND Result_Numeric_Value:[0 TO *]';
        }
        if (pdqcVariableId == "2") {
            // Vital signs
            let pdqcVariableOptionSelectedtxt = pdqcVariableOptionSelected.split("|");
            solrQueryTxt = 'Flowsheet_Name:"' + pdqcVariableOptionSelectedtxt[0] + '" AND Flowsheet_Date:' + frequency;
        }
        if (pdqcVariableId == "3") {
            // Medication
            let pdqcVariableOptionSelectedtxt = pdqcVariableOptionSelected.split("|");
            solrQueryTxt = "Medication_Gpi:" + pdqcVariableOptionSelectedtxt[1] + " AND Medication_OrderedDate:" + frequency;
        }
        if (pdqcVariableId == "4") {
            // Imaging
            solrQueryTxt = "(Free_Text_1:'" + pdqcVariableOptionSelected + "' OR  Free_Text_2:'" + pdqcVariableOptionSelected + "') AND Created_on:" + frequency;
        }
        if (pdqcVariableId == "5") {
            // Admission
            admissionText = 'AdmissionDate';
            if (pdqcVariableOptionSelected.toLowerCase() == "inpatient") {
                admissionText = 'AdmissionDate';
            }
            if (pdqcVariableOptionSelected.toLowerCase() == "discharged") {
                admissionText = 'DischargeDateKey';
            }
            solrQueryTxt = 'PatientClass:"' + pdqcVariableOptionSelected + '" AND ' + admissionText + ':"' + pdqcVariableValueSeleted + '"';
        }
        return solrQueryTxt;
    },
    /**
     * Generate Solr query for before after analysis.
     * 
     * @param {number} measureType Measure type.
     * @param {string} measureCodeName Measure code.
     * @param {string} orderedDate Intervention date
     * @param {number} patientMrn Patient MRN
     * @param {string} queryFlag Query flag. BEFORE / AFTER
     * 
     * @returns Solr query for before after analysis
     */
    'baaQueryText': function (measureType, measureCodeName, orderedDate, patientMrn, queryFlag = 'BEFORE') {
        var propertiesObjectForMeasure = {
            "q": `Patient_Mrn:${patientMrn}`,
        };

        var beforeAfterQuery = `[* TO ${orderedDate}]`;
        if (queryFlag == 'AFTER') {
            beforeAfterQuery = `[${orderedDate} TO *]`;
        }

        if (measureType == 1) {
            // Lab
            var labComponentLoinc = measureCodeName.split('|')[1];
            propertiesObjectForMeasure = {
                "q": `Patient_Mrn:${patientMrn}`,
                "fq": `LabComponent_LoincCode:${labComponentLoinc} AND Created_on:` + beforeAfterQuery,
            };
        }
        if (measureType == 3) {
            // Medication
            var medicationGpi = measureCodeName.split('|')[1];
            propertiesObjectForMeasure = {
                "q": `Patient_Mrn:${patientMrn}`,
                "fq": `Medication_Gpi:${medicationGpi} AND Medication_StartDate:` + beforeAfterQuery,
            };
        }
        if (measureType == 5) {
            // Admission
            let patientClass = '*';
            let dateField = 'AdmissionDate';
            if (measureCodeName == 'Inpatient') {
                patientClass = 'Inpatient';
                dateField = 'AdmissionDate';
            }
            if (measureCodeName == 'Outpatient visit') {
                patientClass = 'Outpatient';
                dateField = 'AdmissionDate';
            }
            if (measureCodeName == 'Discharged') {
                patientClass = 'Outpatient';
                dateField = 'DischargeDate';
            }
            propertiesObjectForMeasure = {
                "q": `Patient_Mrn:${patientMrn}`,
                "fq": `PatientClass:${patientClass} AND ${dateField}:` + beforeAfterQuery,
            };
        }
        return propertiesObjectForMeasure;
    },
    /**
    * Generate API Respose JSON using parameters provided
    *
    * @param {Object} res Response Object
    * @param {string} msg Message|Error or Message or Error. (general message, success message or error message. If want to send both message & error, use pipe separeted string.). Default is empty string.
    * @param {number} code HTTP Status Code. Default is 400.
    * @param {string[]} data Response Payload. Default is empty array.
    * 
    * @returns {string} API Respose in JSON format
    */
    'generateApiResponse': async function (res, msg = '', code = 400, data = []) {
        var success = false;
        var statusCode = code;
        var statusMessage = 'failure';
        var responseMessage = '';
        var responseError = '';

        if (msg == '' || msg.split('|').length <= 1) {
            responseMessage = msg;
            responseError = msg;
        } else {
            var messages = msg.split('|');
            responseMessage = messages[0];
            responseError = messages[1];
        }

        var responseResult = data;
        if (statusCode == 200) {
            success = true;
            statusMessage = 'ok';
            responseError = '';
        }
        return await res.status(statusCode).json({
            success: success,
            status: statusMessage,
            code: statusCode,
            message: responseMessage,
            error: responseError,
            result: responseResult
        });
    },
    /**
    * Process solr response of chart review
    *
    * @param {Object} res Response Object
    * @param {Object} vitalSings object of vital signs
    *
    * @returns {Object} chart review response in object
    */
    'chartReviewSolrResponse': async function (res, vitalSings) {
        let vitalValue = vitalSings.value.split("_");
        let object = {};
        let solResponse = res;
        let allVitalSigns = [];

        object.lowestValue = '';
        object.higestValue = '';
        object.all = '';

        if (vitalValue.length > 1 && vitalSings.id != 2) {
            if (vitalValue[1] == 2) {
                //lowest value
                let lowestValue = arrayFunctions.getValueFromArray(solResponse, 'Flowsheet_Value', 3);
                let lowestFlowsheetValue = lowestValue['Flowsheet_Value'];
                object.lowestValue = [{
                    'value': lowestFlowsheetValue, 'date': this.dateFromatForChartReview(lowestValue['Flowsheet_Date'])
                }]
            }

            if (vitalValue[1] == 3) {
                //highest value
                let highestValue = arrayFunctions.getValueFromArray(solResponse, 'Flowsheet_Value', 2);
                higestFlowsheetValue = highestValue['Flowsheet_Value'];
                object.higestValue = [{
                    'value': higestFlowsheetValue, 'date': this.dateFromatForChartReview(highestValue['Flowsheet_Date'])
                }]
            }
        }
        //all value
        if (vitalValue.length == 1 && vitalSings.id != 2) {
            solResponse.forEach(async (item) => {
                let lowestValue = arrayFunctions.getValueFromArray(solResponse, 'Flowsheet_Value', 3);
                let lowestFlowsheetValue = lowestValue['Flowsheet_Value'];
                object.lowestValue = [{
                    'value': lowestFlowsheetValue, 'date': this.dateFromatForChartReview(lowestValue['Flowsheet_Date'])
                }]

                let highestValue = arrayFunctions.getValueFromArray(solResponse, 'Flowsheet_Value', 2);
                higestFlowsheetValue = highestValue['Flowsheet_Value'];
                object.higestValue = [{
                    'value': higestFlowsheetValue, 'date': this.dateFromatForChartReview(highestValue['Flowsheet_Date'])
                }]

                Flowsheet_Date = this.dateFromatForChartReview(item['Flowsheet_Date']);
                allVitalSigns.push({
                    'value': item['Flowsheet_Value'], 'date': Flowsheet_Date
                })
            });
        }
        // for Blood pressure vital signs
        if (vitalSings.id == 2) {
            solResponse.forEach(async (item) => {
                let systolic = [];
                let diastolic = [];
                lowestFlowsheetValue = item['Flowsheet_Value']
                if (typeof lowestFlowsheetValue !== 'undefined') {
                    let val = lowestFlowsheetValue[0].split('/')
                    if (vitalValue.length == 1) {
                        systolic.push(val[0])
                        diastolic.push(val[1])
                        let obj1 = {
                            'value': systolic, 'date': this.dateFromatForChartReview(item['Flowsheet_Date'])
                        }
                        object.lowestValue = [obj1]

                        let obj = {
                            'value': diastolic, 'date': this.dateFromatForChartReview(item['Flowsheet_Date'])
                        }
                        object.higestValue = [obj]

                        allVitalSigns.push({
                            'value': item['Flowsheet_Value'], 'date': this.dateFromatForChartReview(item['Flowsheet_Date'])
                        })
                    }
                    if (vitalValue[1] == 2) {
                        systolic.push(val[0])
                        let obj1 = {
                            'value': systolic, 'date': this.dateFromatForChartReview(item['Flowsheet_Date'])
                        }
                        object.lowestValue = [obj1]

                    }
                    if (vitalValue[1] == 3) {
                        diastolic.push(val[1])
                        let obj = {
                            'value': diastolic, 'date': this.dateFromatForChartReview(item['Flowsheet_Date'])
                        }
                        object.higestValue = [obj]
                    }
                }
            })
        }

        object.all = allVitalSigns;
        object.name = vitalSings.name
        object.id = vitalSings.id
        return object;
    },
    /**
    * Process solr response of chart review
    *
    * @param {Object} res Response Object
    * @param {Object} systemEntry object of systemEntry Labs
    *
    * @returns {Object} chart review response in object
    */
    'systemEntryLabsSolrResponse': async function (item, systemEntry) {
        let object = {};
        let allLabsComponentName = [];
        let allFlowsheetUrine = [];
        let allFlowsheetStool = [];

        LabComponent_Name = item['LabComponent_Name'];
        if (typeof LabComponent_Name !== 'undefined') {
            object.labName = LabComponent_Name[0];
            object.labValue = item['Result_Value'][0];
            object.labDate = this.dateFromatForChartReview(item['Created_on']);
            allLabsComponentName.push(object);
        } else {
            let Flowsheet_Name = item['Flowsheet_Name'];
            if (typeof Flowsheet_Name !== 'undefined') {
                Flowsheet_Name = Flowsheet_Name.toString().toLowerCase();
                if (Flowsheet_Name.match(/urine output.*/)) {
                    object.urineName = Flowsheet_Name[0];
                    object.urineValue = item['Flowsheet_Value'][0];
                    object.urineDate = this.dateFromatForChartReview(item['Flowsheet_Date']);
                    allFlowsheetUrine.push(object);
                }
                if (Flowsheet_Name.match(/stool.*/)) {
                    object.stoolName = Flowsheet_Name[0];
                    object.stoolValue = item['Flowsheet_Value'][0];
                    object.stoolDate = this.dateFromatForChartReview(item['Flowsheet_Date']);
                    allFlowsheetStool.push(object);
                }
            }
        }
        return object;
    },
    'dateFromatForChartReview': function (date = '') {
        let formateDate = false;
        if (date !== '' && date !== undefined) {
            dateStr = JSON.stringify(date);
            dateStr = dateStr.substring(0, dateStr.lastIndexOf("Z"));
            formateDate = dateStr.replace('["', '');
        }
        return formateDate;
    },

    'path_join': function () {
        // trim slashes from arguments, prefix a slash to the beginning of each, re-join (ignores empty parameters)
        var args = Array.prototype.slice.call(arguments, 0)
        var nonempty = args.filter(function(arg, idx, arr) {
            return typeof(arg) != 'undefined'
        })
        var trimmed = nonempty.map(function(arg, idx, arr) {
            return '/' + String(arg).replace(new RegExp('^/+|/+$'), '')
        })
        return trimmed.join('')
    },

    'authentication': async function (facility_fhir_id,facility_fhir_secret) {
        const axios = require("axios");
        var keySecret = Buffer.from(facility_fhir_id+":"+facility_fhir_secret).toString('base64');
        var auth = 'Basic '+keySecret;
        var token = '';

        var apiUrl = 'https://api.athenahealth.com/oauthpreview/token';
        var method = 'POST';
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': auth
        }
        var config = {
            headers:headers
        }
        var querystring = require('querystring')
        var body = querystring.stringify({grant_type: 'client_credentials'})
            
        var { data } = await axios.post(apiUrl, body, config);
        return await data.access_token;
    },

    'department': async function (token,facility_practice_id) {
        version = 'preview1';
        const axios = require("axios");
        var auth = 'Bearer '+token;

        var apiUrl = 'https://api.athenahealth.com/'+version+'/'+facility_practice_id+'/departments';
       
        var method = 'get';
        var headers = {'Authorization':auth}
        
        var config = {
            headers:headers
        }
        var querystring = require('querystring')
        var body = querystring.stringify({providerlist: false,showalldepartments:false})
       
        apiUrl = apiUrl+'?'+body;
         
        var { data } = await axios.get(apiUrl,config);
        var departments = data.departments;
        return await departments;
    },

    'feedback': async function (facility_survey_token,compaignId, email) {
        const axios = require("axios");
        var token = 'Token '+facility_survey_token;
        var apiUrl = 'https://app.promoter.io/api/v2/feedback/?survey__campaign='+compaignId+'&survey__contact__email='+email;
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }
        var config = {
            headers:headers
        }

        var { data } = await axios.get(apiUrl,config);
        console.log(data.results);
        return data.results;
    }
};

module.exports = helpers;