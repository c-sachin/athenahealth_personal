require('dotenv').config();
const express = require("express");
const dbMysql = require("../db/dbMysql");
var dateFormat = require('dateformat');
var now = new Date();
const router = express.Router();
const helpers = require('../lib/helpers');
const patientSearchModel = require("../models/patientSearch");
const axios = require('axios');

const SOLR_URL = process.env.SOLR_URL;

router.post('/patientScreening', async (req, res) => {
    var query = patientSearchModel.getPatientScreeningList(0, '');
    var [patientScreeningRows] = await dbMysql.execute(query);
    if (typeof patientScreeningRows == 'undefined' || patientScreeningRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 404, []);
    }

    return await helpers.generateApiResponse(res, 'Facility list found.', 200, patientScreeningRows);
});

router.post('/getParametersTableValues', async (req, res) => {
    var parameterTable = req.body.parameterTable;
    if (parameterTable == null || parameterTable == "") {
        return await helpers.generateApiResponse(res, 'Please fill all required fields', 400, []);
    }
    let query = patientSearchModel.getParametersTableValues(parameterTable)
    var [parameterTableValueRows] = await dbMysql.execute(query);
    if (typeof parameterTableValueRows == 'undefined' || parameterTableValueRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 404, []);
    }
    
    return await helpers.generateApiResponse(res, 'Table list found.', 200, parameterTableValueRows);
});

router.post('/patientSearchQuery', async (req, res) => {
    if (req.body.screeningName == null || req.body.screeningName == "" || req.body.patientScreeningData.length < 0) {
        return await helpers.generateApiResponse(res, 'Please fill all required fields', 400, []);
    }
    var userId = req.query.user_id;
    let dailyQueryId = (req.body.dailyQueryId == '' ? null : req.body.dailyQueryId);
    let beforeAfterId = (req.body.beforeAfterId == '' ? null : req.body.beforeAfterId);

    var post = {
        psq_name: req.body.screeningName,
        psq_daily_query_id: dailyQueryId,
        baa_baa_id: beforeAfterId,
        psq_user_id: userId,
        psq_created_timestamp: dateFormat(now, "yyyy-mm-dd h:MM:ss"),
        psq_active: '1'
    };
    const dbMysql2 = await dbMysql.connection();

    await dbMysql2.beginTransaction();
    var insertPsqQuery = patientSearchModel.insertPsq();

    var [psqInsert] = await dbMysql2.query(insertPsqQuery, post);
    if (psqInsert.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in inserting patient screening.', 400, []);
    }

    var patientCriteriaGpId = psqInsert.insertId;

    req.body.patientScreeningData.forEach(async function (ParametersArray) {
        var criteriGroupName = ParametersArray.groupName;
        var patientCriteriaGp = { psqc_psq_id: patientCriteriaGpId, psqc_group_condition: 'And', group_criteria_name: criteriGroupName }
        var insertPsqCriterionGroupQuery = patientSearchModel.insertPsqCriterionGroup();
        var [psqGroupInsert] = await dbMysql2.query(insertPsqCriterionGroupQuery, patientCriteriaGp);
        if (psqGroupInsert.affectedRows <= 0) {
            await dbMysql2.rollback();
            return await helpers.generateApiResponse(res, 'Something went wrong in inserting patient screening group.', 400, []);
        }
        var solarQuery = '';
        var solarQueryCondition
        var i = 0;
        // var j = 0;
        var j = 2;

        var parameterLength = ParametersArray.Parameters.length;
        // for loop of parameters
        ParametersArray.Parameters.forEach(async function (ParameterArray) {
            i++;
            var criteriaonName = ParameterArray.groupCriteriaName;
            var paramterCondition = ParameterArray.parameterCondition;
            var parameterConditionVal = ParameterArray.parameterConditionVal;
            var parameterTable = ParameterArray.parameterTable;
            var parameteerTableValues = ParameterArray.parameteerTableValues;
            var parameterSubTableValues = ParameterArray.parameterSubTableValues;
            var parameterSubTableDataValues = ParameterArray.parameterSubTableDataValues;
            var finalCondition = '';
            var tabletext = '';
            var tableValueText = '';

            var expr = parameterTable;
            switch (expr) {
                case '1': //patient demographics
                    tabletext = "Patient Demographics";
                    tableValueText = parameteerTableValues;
                    let subCondtn1 = helpers.patientDemographicSolr(parameteerTableValues, parameterSubTableValues, parameterSubTableDataValues)
                    finalCondition = subCondtn1;
                    break

                case '2': //order result

                    tabletext = "Ordered Tests/Procedures";
                    var orderValue = parameteerTableValues.split("|");
                    tableValueText = orderValue[0];
                    finalCondition = 'Procedure_CptCode:' + orderValue[1];
                    break;

                case '3': // order result with range
                    let subCondtn2 = ''
                    tabletext = "Ordered Results With range";
                    tableValueText = parameteerTableValues;
                    if (parameterSubTableValues == "less than") {
                        subCondtn2 = 'LabComponent_Name:"' + parameteerTableValues + '" AND Result_Value:[* TO ' + parameterSubTableDataValues + ']';
                    }
                    else if (parameterSubTableValues == "greater than") {
                        subCondtn2 = 'LabComponent_Name:"' + parameteerTableValues + '" AND Result_Value:[' + parameterSubTableDataValues + ' TO *]';
                    }
                    else {
                        resultValue = parameterSubTableDataValues.split("-");
                        subCondtn2 = 'LabComponent_Name:"' + parameteerTableValues + '" AND Result_Value:[' + resultValue[0] + ' TO ' + resultValue[1] + ']';
                    }
                    finalCondition = subCondtn2;
                    break;

                case '4': // condition/problems
                    tabletext = "Conditions/Problems";
                    var diagnosisValue = parameteerTableValues.split("|");
                    tableValueText = diagnosisValue[0];
                    finalCondition = 'Diagnosis_Value:' + diagnosisValue[1];
                    break;

                case '5': // medication
                    tabletext = "Medications";
                    medicationValue = parameteerTableValues.split("|");
                    tableValueText = medicationValue[0];
                    finalCondition = 'Medication_Gpi:' + medicationValue[1];
                    break;

                case '7': // free text in notes
                    tabletext = "Free Text in notes";
                    tableValueText = 'Free Text in notes';
                    finalCondition = 'Free_Text_1:' + parameterSubTableDataValues;

            }
            (paramterCondition == 'is not') ? finalCondition = '-(' + finalCondition + ')' : finalCondition = finalCondition
            solarQueryCondition = parameterConditionVal;
            /* code for apply parenthesis to respective criterion*/
            if (i > 2) j++
            if (parameterLength >= 3) {
                if (solarQuery == '' || i == parameterLength) {
                    solarQuery += "(" + finalCondition + " " + solarQueryCondition + " ";
                }
                else if (i < parameterLength && i != 1) {
                    solarQuery += "(" + finalCondition + " " + solarQueryCondition + " "
                }
            } else {
                solarQuery += finalCondition + " " + solarQueryCondition + " ";
            }

            /* code for apply parenthesis to respective criterion*/
            var finalQuery = paramterCondition + "--" + parameterTable + "--" + parameteerTableValues + "--" + parameterSubTableValues + "--" + parameterSubTableDataValues;
            var psqcCriterionText = paramterCondition + "|" + tabletext + "|" + tableValueText + "|" + parameterSubTableValues + "|" + parameterSubTableDataValues;
            var patientCriteria = { psqc_group_id: psqGroupInsert.insertId, psqc_criterion_name: criteriaonName, psqc_criterion_text: psqcCriterionText, psqc_criterion_condition: parameterConditionVal, psqc_criterion: finalQuery }
            //save crieterion to DB
            var insertPsqCriterionQuery = patientSearchModel.insertPsqCriterion();

            var [psqCriteriaInsert] = await dbMysql2.query(insertPsqCriterionQuery, patientCriteria);
            if (psqCriteriaInsert.affectedRows <= 0) {
                await dbMysql2.rollback();
                return await helpers.generateApiResponse(res, 'Something went wrong in inserting patient screening criteria.', 400, []);
            }
        });
        /* code for close parenthesis to respective criterion*/
        if (parameterLength >= 3) {
            for (k = 1; k <= j; k++) {
                solarQuery = solarQuery + ")";
            }
        }
        /* code for close parenthesis to respective criterion*/
        var post = {
            solar_query_repsonse: solarQuery,
            solar_query_reponse_patients_cnt: "--"

        };
        let query = patientSearchModel.updatePatientScreening(patientCriteriaGpId)
        var [psqScreeningUpdateInsert] = await dbMysql2.query(query, post);
        if (psqScreeningUpdateInsert.affectedRows <= 0) {
            await dbMysql2.rollback();
            return await helpers.generateApiResponse(res, 'Something went wrong in inserting patient screening updated.', 400, []);
        }
        await dbMysql2.commit();
        await dbMysql2.release();
        return await helpers.generateApiResponse(res, 'Patient screening added successfully', 200, []);
    });
});

router.post('/getSubTableValues', async (req, res) => {
    var parameterSubTable = req.body.parameterSubTable;
    if (parameterSubTable == null || parameterSubTable == "") {
        return await helpers.generateApiResponse(res, 'Please fill all required fields', 400, []);
    }
    let query = patientSearchModel.getSubTableValues(parameterSubTable)
    var [parameterSubtableValueRows] = await dbMysql.execute(query);
    if (typeof parameterSubtableValueRows == 'undefined' || parameterSubtableValueRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data Found', 404, []);
    }

    return await helpers.generateApiResponse(res, 'Subtable list found.', 200, parameterSubtableValueRows);
});

router.post('/patientScreeningDelete/:id', async (req, res) => {
    let id = req.params.id;
    var post = { psq_id: id };
    let query = patientSearchModel.patientScreeningDelete()
    var [patientScreeningDelete] = await dbMysql.query(query, post);

    if (typeof patientScreeningDelete.affectedRows == 'undefined' || patientScreeningDelete.affectedRows <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    return await helpers.generateApiResponse(res, 'patient screening deleted successfully.', 200, []);
});

router.post('/patientScreeningEdit/:id', async (req, res) => {
    let id = req.params.id;
    var promiseArray = [];
    let query = patientSearchModel.getPatientScreeningList(1, id)

    var [patinetScreening] = await dbMysql.query(query);

    if (typeof patinetScreening == 'undefined' || patinetScreening.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    let groupCriteriaId = patinetScreening[0].psqc_group_id;
    let psqName = patinetScreening[0].psq_name;
    let psqDailyQueryId = patinetScreening[0].psq_daily_query_id;
    let psqBeforeAfterId = patinetScreening[0].baa_baa_id;

    let queryGroup = patientSearchModel.groupDetails(groupCriteriaId)

    var [patientScreeningCriteria] = await dbMysql.query(queryGroup);

    if (typeof patientScreeningCriteria == 'undefined' || patientScreeningCriteria.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    await patientScreeningCriteria.forEach(async (val) => {

        let parameterStr = val.psqc_criterion;
        let parameterArry = parameterStr.split("--");

        let ParameterListObject = {};
        ParameterListObject.psqcCriterion = parameterStr;
        ParameterListObject.psqcCriterionCondition = val.psqc_criterion_condition;
        ParameterListObject.psqName = psqName;
        ParameterListObject.psqcCriterionName = val.psqc_criterion_name;
        ParameterListObject.parameterCondition = parameterArry[0];
        ParameterListObject.parameterTable = parameterArry[1];
        ParameterListObject.parameterTableValue = parameterArry[2];
        ParameterListObject.parameterTableValueCondition = parameterArry[3];
        ParameterListObject.parameterTableValueConditionValue = parameterArry[4];
        ParameterListObject.psqcCriterionId = val.psqc_criterion_id;
        ParameterListObject.psqcGroupId = val.psqc_group_id;
        ParameterListObject.parameterTableValuesData = [];
        ParameterListObject.parameterSubTableValuesData = [];
        ParameterListObject.psqDailyQueryId = psqDailyQueryId;
        ParameterListObject.psqBeforeAfterId = psqBeforeAfterId;
        let parameterSubTable = parameterArry[2];
        let querySubTable = patientSearchModel.getSubTableValues(parameterSubTable)

        if (querySubTable != "" && querySubTable != undefined) {
            dbMysql.query(querySubTable, function (err, result) {
                ParameterListObject.parameterSubTableValuesData = result;
            });
        }

        let parameterTable = parameterArry[1];
        if (parameterTable != null && parameterTable != "") {
            let queryTable = patientSearchModel.getParametersTableValues(parameterTable)

            promiseArray.push(new Promise((resolve, reject) => {
                dbMysql.query(queryTable, async function (err, result) {
                    resolve(ParameterListObject);
                });
            }));
        }
    })

    return await helpers.generateApiResponse(res, 'Patient screening edit data', 200, await Promise.all(promiseArray));
});

router.post('/runQuery/:id', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let id = req.params.id;
    var post = { psq_id: id };
    let query = patientSearchModel.getPatientScreeningList(1, id)

    var [patinetScreening] = await dbMysql.query(query);

    if (typeof patinetScreening == 'undefined' || patinetScreening.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    var propertiesObject = { q: patinetScreening[0].solar_query_repsonse, fl: 'Patient_Mrn', facet: 'on', "facet.field": 'Patient_Mrn', "facet.limit": -1, "facet.mincount": 1 };

    var { data } = await axios.get(SOLR_URL, {
        params: propertiesObject
    });

    let response = data;
    if ((response.responseHeader.status) == 400) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong while fetching patient screening data.', 400, []);
    }
    if ((response.responseHeader.status) == 0) {

        var responseArray = response.facet_counts.facet_fields.Patient_Mrn;
        var rowcnt = (responseArray.length) / 2;
        if (rowcnt <= 0) {
            return await helpers.generateApiResponse(res, 'Error: No record found for patient screening data.', 404, []);
        }
        var post = {
            solar_query_reponse_patients_cnt: rowcnt,
            query_run_updated_at: dateFormat(now, "yyyy-mm-dd h:MM:ss")
        };
        let query = patientSearchModel.updatePatientScreening(id)
        var [patinetScreeningUpdate] = await dbMysql.query(query, post);

        if (typeof patinetScreeningUpdate.affectedRows == 'undefined' || patinetScreeningUpdate.affectedRows <= 0) {
            return await helpers.generateApiResponse(res, 'Error:While updating patient screening', 400, []);
        }
        var psqRunPost = {
            psq_run_timestamp: dateFormat(now, "yyyy-mm-dd h:MM:ss"),
            psq_run_count: rowcnt,
            psq_run_psq_id: id
        };

        var insertPsqRunQuery = patientSearchModel.insertPsqRun();
        var [patinetScreeningRun] = await dbMysql.query(insertPsqRunQuery, psqRunPost);
        if (typeof patinetScreeningRun.affectedRows == 'undefined' || patinetScreeningRun.affectedRows <= 0) {
            return await helpers.generateApiResponse(res, 'Error:While inserting into patient screening run', 400, []);
        }
        var psqRunId = patinetScreeningRun.insertId;
        var totalMrnCount = data.response.numFound;
        if (totalMrnCount <= 0) {
            return await helpers.generateApiResponse(res, 'Error:No unique MRN found', 404, []);
        }
        var patientMrnListJson = responseArray;
        var totalDistinctMrnCount = (patientMrnListJson.length / 2);
        var patientMrnListArr = [];

        var sql = patientSearchModel.insertPsqResult();
        var values = [];

        for (var i = 0; i < totalDistinctMrnCount * 2; i += 2) {
            // take every second element
            patientMrnListArr.push(patientMrnListJson[i]);
        }

        patientMrnListArr.forEach(function (item) {
            var temp = [item, null, psqRunId];
            values.push(temp);
        })

        var [patinetScreeningRunResult] = await dbMysql.query(sql, [values]);
        if (typeof patinetScreeningRunResult.affectedRows == 'undefined' || patinetScreeningRunResult.affectedRows <= 0) {
            return await helpers.generateApiResponse(res, 'Error:While inserting into patient screening run', 400, []);
        }

        return await helpers.generateApiResponse(res, 'Query Executed Successfully', 200, []);
    }
});

router.get('/patientResult/:id', async (req, res) => {
    var id = req.params.id

    let query = patientSearchModel.getPsqRun(id)
    var [getPsqrun] = await dbMysql.query(query);
    if (typeof getPsqrun == 'undefined' || getPsqrun.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    var results = {};

    var psqRunId = getPsqrun[0].psq_id;
    let patientResultQuery = patientSearchModel.getPatientResult(psqRunId)
    var [getPsqResult] = await dbMysql.query(patientResultQuery);

    if (typeof getPsqResult == 'undefined' || getPsqResult.length <= 0) {
        return await helpers.generateApiResponse(res, 'No data found', 404, []);
    }

    results['rows'] = getPsqResult;
    return await helpers.generateApiResponse(res, 'Patient Result', 200, results);
});

router.post('/patientScreeningUpdate/:id', async (req, res) => {
    if (req.body.screeningName == null || req.body.screeningName == "" || req.body.patientScreeningData.length < 0) {
        return await helpers.generateApiResponse(res, 'Please fill all required fields', 400, []);
    }

    const dbMysql2 = await dbMysql.connection();

    await dbMysql2.beginTransaction();
    let id = req.params.id;
    let query = patientSearchModel.deleteCriterion(id)

    var [psqCriteriaDelete] = await dbMysql2.query(query);
    if (psqCriteriaDelete.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in delete patient screening criteria.', 400, []);
    }

    let dailyQueryId = (req.body.dailyQueryId == '' ? null : req.body.dailyQueryId);
    let beforeAfterId = (req.body.beforeAfterId == '' ? null : req.body.beforeAfterId);
    var post = {
        psq_name: req.body.screeningName,
        psq_daily_query_id: dailyQueryId,
        baa_baa_id: beforeAfterId
    }
    let queryUpdate = patientSearchModel.updatePatientScreening(id)
    var [psqScreeningUpdate] = await dbMysql2.query(queryUpdate, post);
    if (psqScreeningUpdate.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in update patient screening.', 400, []);
    }
    var Parameters = req.body.patientScreeningData[0].Parameters;
    var solarQuery = '';
    var solarQueryCondition;
    var criteriaGroupId = '';
    var i = 0;
    // var j = 0;
    var j = 2;
    var parameterLength = Parameters.length;

    Parameters.forEach(async function (ParameterArray) {
        i++;

        var criteriaonName = ParameterArray.psqcCriterionName;
        var paramterCondition = ParameterArray.parameterCondition;
        var parameterConditionVal = ParameterArray.parameterConditionVal;
        var parameterTable = ParameterArray.parameterTable;
        var parameteerTableValues = ParameterArray.parameteerTableValues;
        var parameterSubTableValues = ParameterArray.parameterSubTableValues;
        var parameterSubTableDataValues = ParameterArray.parameterSubTableDataValues;
        var paramertCriterionId = ParameterArray.paramertCriterionId;
        if (typeof ParameterArray.paramertCriterionGroupId != "undefined") {
            criteriaGroupId = ParameterArray.paramertCriterionGroupId
        }
        var finalCondition = '';
        var subCondtn = '';

        var tabletext = '';

        var tableValueText = '';


        var expr = parameterTable;

        switch (expr) {
            case '1': //patient demographics
                tabletext = "Patient Demographics";
                tableValueText = parameteerTableValues;
                let subCondtn1 = helpers.patientDemographicSolr(parameteerTableValues, parameterSubTableValues, parameterSubTableDataValues)
                finalCondition = subCondtn1;
                break

            case '2': //order result

                tabletext = "Ordered Tests/Procedures";
                var orderValue = parameteerTableValues.split("|");
                tableValueText = orderValue[0];
                finalCondition = 'Procedure_CptCode:' + orderValue[1];
                break;

            case '3': // order result with range
                let subCondtn2 = ''
                tabletext = "Ordered Results With range";
                tableValueText = parameteerTableValues;
                if (parameterSubTableValues == "less than") {
                    subCondtn2 = 'LabComponent_Name:"' + parameteerTableValues + '" AND Result_Value:[* TO ' + parameterSubTableDataValues + ']';
                }
                else if (parameterSubTableValues == "greater than") {
                    subCondtn2 = 'LabComponent_Name:"' + parameteerTableValues + '" AND Result_Value:[' + parameterSubTableDataValues + ' TO *]';
                }
                else {
                    resultValue = parameterSubTableDataValues.split("-");
                    subCondtn2 = 'LabComponent_Name:"' + parameteerTableValues + '" AND Result_Value:[' + resultValue[0] + ' TO ' + resultValue[1] + ']';
                }
                finalCondition = subCondtn2;
                break;

            case '4': // condition/problems
                tabletext = "Conditions/Problems";
                var diagnosisValue = parameteerTableValues.split("|");
                tableValueText = diagnosisValue[0];
                finalCondition = 'Diagnosis_Value:' + diagnosisValue[1];
                break;

            case '5': // medication
                tabletext = "Medications";
                medicationValue = parameteerTableValues.split("|");
                tableValueText = medicationValue[0];
                finalCondition = 'Medication_Gpi:' + medicationValue[1];
                break;

            case '7': // free text in notes
                tabletext = "Free Text in notes";
                tableValueText = 'Free Text in notes';
                finalCondition = 'Free_Text_1:' + parameterSubTableDataValues;

        }

        (paramterCondition == 'is not') ? finalCondition = '-(' + finalCondition + ')' : finalCondition = finalCondition
        solarQueryCondition = parameterConditionVal;

        /* code for apply parenthesis to respective criterion*/
        if (i > 2) j++
        if (parameterLength >= 3) {

            if (solarQuery == '' || i == parameterLength) {
                solarQuery += "(" + finalCondition + " " + solarQueryCondition + " ";
            }
            else if (i < parameterLength && i != 1) {
                solarQuery += "(" + finalCondition + " " + solarQueryCondition + " "
            }
        } else {
            solarQuery += finalCondition + " " + solarQueryCondition + " ";
        }

        /* code for apply parenthesis to respective criterion*/

        var finalQuery = paramterCondition + "--" + parameterTable + "--" + parameteerTableValues + "--" + parameterSubTableValues + "--" + parameterSubTableDataValues;
        var psqcCriterionText = paramterCondition + "|" + tabletext + "|" + tableValueText + "|" + parameterSubTableValues + "|" + parameterSubTableDataValues;
        var patientCriteria = { psqc_group_id: criteriaGroupId, psqc_criterion_name: criteriaonName, psqc_criterion_text: psqcCriterionText, psqc_criterion_condition: parameterConditionVal, psqc_criterion: finalQuery }
        //save crieterion to DB
        var insertPsqCriterionQuery = patientSearchModel.insertPsqCriterion();
        var [psqCriteriaInsert] = await dbMysql2.query(insertPsqCriterionQuery, patientCriteria);
        if (psqCriteriaInsert.affectedRows <= 0) {
            await dbMysql2.rollback();
            return await helpers.generateApiResponse(res, 'Something went wrong in inserting patient screening criteria.', 400, []);
        }

    });

    if (parameterLength >= 3) {
        for (k = 1; k <= j; k++) {
            solarQuery += ")";
        }
    }
    var post = {
        solar_query_repsonse: solarQuery,
        solar_query_reponse_patients_cnt: "--"

    };
    var updatePsqByIdQuery = patientSearchModel.updatePsqById(id);
    var [psqScreeningUpdateInsert] = await dbMysql2.query(updatePsqByIdQuery, post);
    if (psqScreeningUpdateInsert.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in inserting patient screening updated.', 400, []);
    }

    await dbMysql2.commit();

    await dbMysql2.release();

    return await helpers.generateApiResponse(res, 'Patient screening updated successfully', 200, []);
});

// Get Daily Query & Before / After Analysis List
router.post('/patientQueryList', async (req, res) => {
    var patientQueryList = {};
    let queryPdq = patientSearchModel.getPdqList()
    let queryBaa = patientSearchModel.getBaaList()

    var [pdqListRows] = await dbMysql.query(queryPdq);

    if (typeof pdqListRows == 'undefined' || pdqListRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }

    var [baaListRows] = await dbMysql.query(queryBaa);

    if (typeof baaListRows == 'undefined' || baaListRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }
    
    patientQueryList.dailyQueryList = pdqListRows;
    patientQueryList.beforeAfterList = baaListRows;

    return await helpers.generateApiResponse(res, 'Patient query list found.', 200, patientQueryList);

});

module.exports = router;