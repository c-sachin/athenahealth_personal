const express = require('express');
const router = express.Router();
var dateFormat = require('dateformat');
const moment = require('node-moment');
const arrayFunctions = require('../lib/arrayFunctions')
const helpers = require('../lib/helpers');
const dbMysql = require("../db/dbMysql");
const patientSearchModel = require("../models/patientSearch");
const patientDailyQueryModel = require("../models/patientDailyQuery");
const axios = require('axios');
var now = new Date();
const SOLR_URL = process.env.SOLR_URL;

router.post('/patientDailyQueryList', async (req, res) => {
    var getPdqListQuery = patientSearchModel.getPdqList();
    var [pdqRows] = await dbMysql.execute(getPdqListQuery);
    if (typeof pdqRows == 'undefined' || pdqRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 400, []);
    }

    return await helpers.generateApiResponse(res, 'PDQ list found.', 200, pdqRows);
});

router.post('/dailyQueryDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { pdq_id: id };

    let deletePdqQuery = patientDailyQueryModel.updatePdq(1, id)
    var [deletePdqRows] = await dbMysql.query(deletePdqQuery, post);
    if (typeof deletePdqRows == 'undefined' || deletePdqRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }

    return await helpers.generateApiResponse(res, 'PDQ deleted successfully.', 200, deletePdqRows);
});

router.post('/getVariableValues', async (req, res) => {
    var variableType = req.body.variableType;
    if (variableType == null || variableType == '') {
        return await helpers.generateApiResponse(res, 'Error: Invalid Parameter passed.', 400, []);
    }
    var getVariableValueQuery = patientDailyQueryModel.getVariableValues(variableType);

    var resultData = [];

    if (getVariableValueQuery == '' || getVariableValueQuery == undefined) {
        return await helpers.generateApiResponse(res, 'Variable data not found.', 400, resultData);
    }

    const [variableValueRows] = await dbMysql.execute(getVariableValueQuery);
    if (typeof variableValueRows != 'undefined' && variableValueRows.length > 0) {
        resultData = variableValueRows;
    }

    return await helpers.generateApiResponse(res, 'Variable data found.', 200, resultData);
});

router.post('/getVariableRange', async (req, res) => {
    var variableType = req.body.variableType;
    if (variableType == null || variableType == '') {
        return await helpers.generateApiResponse(res, 'Error: Invalid Parameter passed.', 400, []);
    }

    var getVariableRangeDataQuery = patientDailyQueryModel.getVariableRange(variableType);

    var resultData = [];

    if (getVariableRangeDataQuery == '' || getVariableRangeDataQuery == undefined) {
        return await helpers.generateApiResponse(res, 'Variable data not found.', 400, resultData);
    }

    const [variableRangeRows] = await dbMysql.execute(getVariableRangeDataQuery);
    if (typeof variableRangeRows != 'undefined' && variableRangeRows.length > 0) {
        resultData = variableRangeRows;
    }

    return await helpers.generateApiResponse(res, 'Variable data found.', 200, resultData);
});

router.post('/patientDailyQueryAdd', async (req, res) => {
    if (req.body.variableName == null || req.body.variableName == "" || req.body.variables.length <= 0) {
        return await helpers.generateApiResponse(res, 'Invalid Parameter passed.', 400, []);
    }

    var userId = req.query.user_id;
    var post = {
        pdq_name: req.body.variableName,
        pdq_user_id: userId,
        pdq_created_timestamp: dateFormat(now, "yyyy-mm-dd h:MM:ss"),
        pdq_active: '1'
    };

    const dbMysql2 = await dbMysql.connection();

    await dbMysql2.beginTransaction();
    var insertPdqQuery = patientDailyQueryModel.insertPatientDaily();
    var [pdqRows] = await dbMysql2.query(insertPdqQuery, post);
    if (pdqRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in creating new daily query.', 400, []);
    }

    var pdqcPdqId = pdqRows.insertId;
    req.body.variables.forEach(async function (variableArray) {
        var pdqcFrequency = req.body.queryFrequency;
        var pdqcVariableId = variableArray.variableType;
        var pdqcVariableOptionSelected = variableArray.variableValue;
        var pdqcVariablePeriodSeleted = variableArray.variablePeriod;
        var pdqcVariableValueSeleted = '';
        if (pdqcVariableId == 5) {
            pdqcVariableValueSeleted = dateFormat(variableArray.variableDate, "yyyy-mm-dd");
            pdqcVariableValueSeleted = pdqcVariableValueSeleted + "T00:00:00Z";
        }
        else {
            pdqcVariableValueSeleted = variableArray.variableRangeValue;
        }
              
        var solrQueryTxt = helpers.getSolrText(pdqcVariableId, pdqcVariableOptionSelected, pdqcVariableValueSeleted, pdqcFrequency);

        var patientDailyQueryPost = {
            pdqc_frequency: pdqcFrequency,
            pdqc_variable_id: pdqcVariableId,
            pdqc_variable_option_selected: pdqcVariableOptionSelected,
            pdqc_variable_period_seleted: pdqcVariablePeriodSeleted,
            pdqc_pdq_id: pdqcPdqId,
            pdqc_variable_value_seleted: pdqcVariableValueSeleted,
            pdqc_variable_solr_querytxt: solrQueryTxt,
        };
        //save crieterion to DB

        var insertPdqCriterionQuery = patientDailyQueryModel.insertPdqCriterion();
        var [pdqCriterionRows] = await dbMysql2.query(insertPdqCriterionQuery, patientDailyQueryPost);
        if (pdqCriterionRows.affectedRows <= 0) {
            await dbMysql2.rollback();
            return await helpers.generateApiResponse(res, 'Something went wrong in creating daily query criterion.', 400, []);
        }

    });
    await dbMysql2.commit();
    await dbMysql2.release();
    return await helpers.generateApiResponse(res, 'Daily Query added successfully.', 200, []);
});

router.post('/dailyQueryEdit/:id', async (req, res) => {
    let id = req.params.id;

    var promiseArray = [];

    var getPdqQuery = patientDailyQueryModel.getDailyQuery(id);
    var [pdqRows] = await dbMysql.execute(getPdqQuery);
    if (typeof pdqRows == 'undefined' || pdqRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    let pdqName = pdqRows[0].pdq_name;
    let pdqId = pdqRows[0].pdq_id;

    let getPdqCriterionQuery = patientDailyQueryModel.getPdqCriterion(pdqId);

    var [pdqCriterionRows] = await dbMysql.execute(getPdqCriterionQuery);
    if (typeof pdqCriterionRows == 'undefined' || pdqCriterionRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No criteria data found.', 404, []);
    }

    await pdqCriterionRows.forEach(async (val) => {
        let pdqcFrequency = val.pdqc_frequency;
        let pdqcVariableId = val.pdqc_variable_id;
        let variableListObject = {};

        variableListObject.variableType = pdqcVariableId;
        variableListObject.variableValue = val.pdqc_variable_option_selected;
        variableListObject.variableName = pdqName;
        variableListObject.queryFrequency = pdqcFrequency;
        variableListObject.variableRangeValue = val.pdqc_variable_value_seleted;
        variableListObject.pdqcCriterionId = val.pdqc_criterion_id;
        if (pdqcVariableId == 5) {
            variableListObject.variableDate = moment.utc(val.pdqc_variable_value_seleted).valueOf();
        }
        else {
            variableListObject.variableDate = moment.utc(val.pdqc_variable_value_seleted).valueOf();
        }
        variableListObject.variablePeriod = val.pdqc_variable_period_seleted
        variableListObject.variableRangeData = []
        variableListObject.variableValueData = []
        var getVariableRangeDataQuery = patientDailyQueryModel.getVariableRange(pdqcVariableId)

        if (getVariableRangeDataQuery != "" && getVariableRangeDataQuery != undefined) {
            dbMysql.query(getVariableRangeDataQuery, function (err, result) {
                variableListObject.variableRangeData = result;
            });
        }

        if (pdqcVariableId != null && pdqcVariableId != "") {
            var getVariableValueQuery = patientDailyQueryModel.getVariableValues(pdqcVariableId);
            promiseArray.push(new Promise(async (resolve, reject) => {
                var [variableValueRows] = await dbMysql.execute(getVariableValueQuery);
                if (typeof variableValueRows != 'undefined' && variableValueRows.length > 0) {
                    resolve(variableListObject);
                }
            }));
        }
    });
    
    var data = await Promise.all(promiseArray);
    return await helpers.generateApiResponse(res, 'PDQ list found.', 200, data);
});

router.post('/patientDailyQueryUpdate/:id', async (req, res) => {
    if (req.body.variableName == null || req.body.variableName == "" || req.body.variables.length <= 0) {
        return await helpers.generateApiResponse(res, 'Invalid Parameter passed.', 400, []);
    }

    const dbMysql2 = await dbMysql.connection();

    await dbMysql2.beginTransaction();

    var userId = req.query.user_id;
    let id = req.params.id;
    var post = { pdq_name: req.body.variableName, pdq_user_id: userId };

    let deletePdqCriterionQuery = patientDailyQueryModel.deletePdqCriterion(id);
    var [deleteCriterionRows] = await dbMysql2.execute(deletePdqCriterionQuery);
    if (typeof deleteCriterionRows == 'undefined' || deleteCriterionRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Error: Something went wrong in updating criterion.', 400, []);
    }

    let updatePdqQuery = patientDailyQueryModel.updatePdq(0, id);
    var [updatePdqRows] = await dbMysql2.query(updatePdqQuery, post);
    if (typeof updatePdqRows == 'undefined' || updatePdqRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Error: Something went wrong in updating pdq.', 400, []);
    }

    req.body.variables.forEach(async function (variableArray) {
        var pdqcFrequency = req.body.queryFrequency;
        var pdqcVariableId = variableArray.variableType;
        var pdqcVariableOptionSelected = variableArray.variableValue;
        var pdqcVariablePeriodSeleted = variableArray.variablePeriod;
        var pdqcVariableValueSeleted = '';
        if (pdqcVariableId == 5) {
            pdqcVariableValueSeleted = dateFormat(variableArray.variableDate, "yyyy-mm-dd");
            pdqcVariableValueSeleted = pdqcVariableValueSeleted + "T00:00:00Z";
        }
        else {
            pdqcVariableValueSeleted = variableArray.variableRangeValue;
        }
     
        var solrQueryTxt = helpers.getSolrText(pdqcVariableId, pdqcVariableOptionSelected, pdqcVariableValueSeleted, pdqcFrequency);

        var patientDailyQueryPost = {
            pdqc_frequency: pdqcFrequency,
            pdqc_variable_id: pdqcVariableId,
            pdqc_variable_option_selected: pdqcVariableOptionSelected,
            pdqc_variable_period_seleted: pdqcVariablePeriodSeleted,
            pdqc_pdq_id: id,
            pdqc_variable_value_seleted: pdqcVariableValueSeleted,
            pdqc_variable_solr_querytxt: solrQueryTxt,
        }
        //save crieterion to DB

        var insertPdqCriterionQuery = patientDailyQueryModel.insertPdqCriterion();
        var [pdqCriterionRows] = await dbMysql2.query(insertPdqCriterionQuery, patientDailyQueryPost);
        if (pdqCriterionRows.affectedRows <= 0) {
            await dbMysql2.rollback();
            return await helpers.generateApiResponse(res, 'Something went wrong in updating daily query criterion.', 400, []);
        }
    });
    await dbMysql2.commit();
    await dbMysql2.release();
    return await helpers.generateApiResponse(res, 'Daily Query updated successfully.', 200, []);
});

router.post('/pdqSolrResult/:id', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let id = req.params.id;
    var outputArray = [];
    var mainArray = {}
    let labsArray = [];
    let medicationsArray = [];
    let admissionArray = [];
    let vitalsignsArray = [];
    let imagingArray = [];
    var finalArray = [{ 'qty': '', 'date': '' }];

    let getPatientDataQuery = patientDailyQueryModel.getPatientData(id);
    var [patientDataRow] = await dbMysql.execute(getPatientDataQuery);
    if (typeof patientDataRow == 'undefined' || patientDataRow.length <= 0) {
        return await helpers.generateApiResponse(res, 'No patient data found', 404, []);
    }

    let patientMrn = patientDataRow[0].psq_result_mrn;
    let pdqId = patientDataRow[0].psq_daily_query_id;

    var data = [{
        patientMrn: patientMrn,
        pdqId: pdqId,
    }];

    let getPdqQuery = patientDailyQueryModel.getDailyQuery(pdqId);

    var [pdqRows] = await dbMysql.execute(getPdqQuery);
    if (typeof pdqRows == 'undefined' || pdqRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    pdqRows.forEach(async (pdqArray) => {
        // pdqc_frequency
        let solrQuerytext = pdqArray.pdqc_variable_solr_querytxt;
        let variableType = pdqArray.pdqc_variable_id;
        let variableValue = pdqArray.pdqc_variable_value_seleted;
        let variableOption = pdqArray.pdqc_variable_option_selected;
        let variableValueTxt = '';
        var propertiesObject = { q: "Patient_Mrn:" + patientMrn, fq: solrQuerytext };
        outputArray.push(new Promise(async (resolve, reject) => {
            var { data } = await axios.get(SOLR_URL, {
                params: propertiesObject
            });

            if ((data.responseHeader.status) == 400) {
                return await helpers.generateApiResponse(res, `${body.error.msg}|Query Run Error.`, 400, []);
            }

            if ((data.responseHeader.status) == 0) {
                let solResponse = data.response.docs;
                if (data.response.numFound > 0) {
                    if (variableValue == 2 || variableValue == 3 || variableValue == 4 || variableValue == 5) {
                        let keyName = '';
                        let resultUnit = ''
                        let dateValue = ''
                        let dateTxt = ''
                        let qtyValue = ''
                        // Check variable types
                        if (variableType == 1) {
                            keyName = 'Result_Numeric_Value';
                            resultUnit = "Result_Unit"; dateTxt = 'Created_on'
                        }

                        if (variableType == 2) {
                            keyName = 'Flowsheet_Value';
                            resultUnit = 'Flowsheet_DisplayName';
                            dateTxt = 'Flowsheet_Date';
                        }

                        // Check variable value
                        if (variableValue == 2) {
                            variableValueTxt = '(Highest)';
                            let highestValue = arrayFunctions.getValueFromArray(solResponse, keyName, 2);
                            qtyValue = highestValue[keyName] + " " + highestValue[resultUnit];
                            dateValue = highestValue[dateTxt];
                        }
                        if (variableValue == 3) {
                            variableValueTxt = '(Lowest)';
                            let lowestValue = arrayFunctions.getValueFromArray(solResponse, keyName, 3);
                            qtyValue = lowestValue[keyName] + " " + lowestValue[resultUnit];
                            dateValue = lowestValue[dateTxt];
                        }
                        if (variableValue == 4) {
                            variableValueTxt = '(Mean)';
                            let meanValue = arrayFunctions.getValueFromArray(solResponse, keyName, 4);
                            qtyValue = meanValue;
                        }
                        if (variableValue == 5) {
                            variableValueTxt = '(Median)';
                            let medianValue = arrayFunctions.getValueFromArray(solResponse, keyName, 5);
                            qtyValue = medianValue;
                        }

                        finalArray.forEach(async (item) => {
                            if (variableType == 1) {
                                let object = {};
                                object = {
                                    'qty': qtyValue, 'type': 1,
                                    'date': dateValue,
                                    variableOption: variableOption,
                                    variableValue: variableValueTxt,
                                };
                                labsArray.push(object);
                                mainArray.Labs = labsArray;
                            }

                            if (variableType == 2) {
                                let object = {};
                                object = {
                                    'qty': qtyValue,
                                    'type': 2,
                                    'date': dateValue,
                                    variableOption: variableOption,
                                    variableValue: variableValueTxt,
                                };
                                vitalsignsArray.push(object);
                                mainArray.Vital_signs = vitalsignsArray;
                            }
                            resolve(mainArray);
                        })
                    }
                    else {
                        solResponse.forEach(async (item) => {
                            let object = {}
                            var expr = variableType;
                            switch (expr) {
                                // Lab Variable
                                case 1:
                                    object = {
                                        'qty': item.Result_Numeric_Value + " " + item.Result_Unit,
                                        'type': 1,
                                        'date': item.Created_on,
                                        variableOption: variableOption,
                                        variableValue: variableValueTxt,
                                    };
                                    labsArray.push(object);
                                    mainArray.Labs = labsArray;
                                    break
                                // Vital Signs Variable
                                case 2:
                                    object = {
                                        'qty': item.Flowsheet_Value,
                                        'date': item.Flowsheet_Date,
                                        'type': 2,
                                        variableOption: variableOption,
                                        variableValue: variableValueTxt,
                                    };
                                    vitalsignsArray.push(object);
                                    mainArray.Vital_Signs = vitalsignsArray;
                                    break
                                // Medication Variable
                                case 3:
                                    object = {
                                        'qty': item.Medication_MinimumDose + " " + item.Medication_DoseUnit,
                                        'date': item.Medication_StartDate,
                                        'type': 3, variableOption: variableOption,
                                        variableValue: variableValueTxt,
                                    };
                                    medicationsArray.push(object);
                                    mainArray.Medications = medicationsArray;
                                    break
                                // Imaging Variable
                                case 4:
                                    object = {
                                        'qty': item.Free_Text_1,
                                        'date': item.Created_on,
                                        'type': 4,
                                        variableOption: variableOption,
                                        variableValue: variableValueTxt,
                                    };
                                    imagingArray.push(object);
                                    mainArray.Imaging = imagingArray;
                                    break
                                // Admission Variable
                                case 5:
                                    object = {
                                        'qty': item.Type,
                                        'date': item.AdmissionDate,
                                        'type': 5,
                                        variableOption: variableOption,
                                        variableValue: variableValueTxt,
                                    };
                                    admissionArray.push(object);
                                    mainArray.Admission_status = admissionArray;
                                    break
                            }
                            resolve(mainArray);
                        })
                    }
                }
                else {
                    Promise.reject(new Error('fail')).then(
                        resolve(mainArray)
                    ).catch(e => {
                        console.log('\nNo data found for this query.');
                    });
                }
            }
        }));
    });
    var data = await Promise.all(outputArray);
    return await helpers.generateApiResponse(res, 'PDQ Data found.', 200, data);
});

router.post('/pdqSolrResultMrn/:id', async (req, res) => {
    let id = req.params.id;
    let getPatientDetailsQuery = patientDailyQueryModel.getPatientData(id);
    var [patientRow] = await dbMysql.execute(getPatientDetailsQuery);
    if (typeof patientRow == 'undefined' || patientRow.length <= 0) {
        return await helpers.generateApiResponse(res, 'Patient not found.', 404, []);
    }

    return await helpers.generateApiResponse(res, 'Patient data found.', 200, patientRow);
})

module.exports = router;