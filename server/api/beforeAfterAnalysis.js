require('dotenv').config();
const express = require('express');
const router = express.Router();
var dateFormat = require('dateformat');
const dbMysql = require("../db/dbMysql");
const helpers = require('../lib/helpers')
const patientDailyQueryModel = require("../models/patientDailyQuery");
const beforeAfterAnalysisModel = require("../models/beforeAfterAnalysis");
const axios = require('axios');
var now = new Date();

const SOLR_URL = process.env.SOLR_URL;

router.post('/patient/:patient_id', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let patientId = req.params.patient_id;

    // Check if Patient Id exists
    let query = beforeAfterAnalysisModel.getPatientBaa(patientId);
    const [patientRows] = await dbMysql.execute(query, [patientId]);
    if (typeof patientRows == 'undefined' || patientRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Patient Id not found.', 404, []);
    }

    let patientMrn = patientRows[0].psq_result_mrn;
    let patientName = patientRows[0].patient_name;
    let baaId = patientRows[0].baa_baa_id;

    // Check if BAA Id exists
    let baaExistQuery = beforeAfterAnalysisModel.baaExist(baaId);
    const [baaRows] = await dbMysql.execute(baaExistQuery, [baaId]);
    if (typeof baaRows == 'undefined' || baaRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Before / After analysis not found.', 404, []);
    }

    // Get Intervention details for patient
    let baaData = baaRows[0];
    let baaInterventionType = baaData.baa_intervention_type;
    var interventionType = '';
    var interventionValue = '';
    var measureTypeName = '';
    var measureValue = '';
    var measureFilter = '';
    var measureType = baaData.baa_measure_type;
    var measureCodeName = baaData.baa_measure_code;
    var propertiesObject = {};
    measureValue = baaData.baa_measure_code;

    measureTypeName = 'Admission';
    if (measureType == 1) {
        measureTypeName = 'Lab Component';
    }
    if (measureType == 3) {
        measureTypeName = 'Medication';
    }

    propertiesObject = {
        "q": `Patient_Mrn:${patientMrn}`,
        "rows": 1,
    };

    // Build Solr Query for intervention
    if (baaInterventionType == 3) {
        // Solr Query parameters for Medication
        interventionType = 'Medication';
        var medicationNameGpi = baaData.baa_intervention_code;
        interventionValue = medicationNameGpi;
        var medicationGpi = medicationNameGpi.split('|')[1];
        propertiesObject = {
            "q": `Patient_Mrn:${patientMrn}`,
            "fq": `Medication_Gpi:${medicationGpi}`,
            "sort": "Medication_OrderedDate DESC",
            "rows": 1,
        };
    }
    if (baaInterventionType == 7) {
        // Solr Query parameters for Procedure
        interventionType = 'Procedure';
        var procedureNameCpt = baaData.baa_intervention_code;
        interventionValue = procedureNameCpt;
        var procedureCpt = procedureNameCpt.split('|')[1];
        propertiesObject = {
            "q": `Patient_Mrn:${patientMrn}`,
            "fq": `Procedure_CptCode:${procedureCpt}`,
            "sort": "Procedure_OrderedDate DESC",
            "rows": 1,
        };
    }

    var { data } = await axios.get(SOLR_URL, {
        params: propertiesObject
    });

    const interventionData = data;

    if ((interventionData.responseHeader.status) == 400) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong while fetching intervention data.', 400, []);
    }

    if ((interventionData.responseHeader.status) != 0) {
        return await helpers.generateApiResponse(res, 'Error: Before / After analysis not found.', 404, []);
    }

    if (interventionData.response.numFound <= 0) {
        var data = [{
            analysis: false,
            patientMrn: patientMrn,
            patientName: patientName,
            interventionType: interventionType,
            interventionValue: interventionValue,
            measureType: measureTypeName,
            measureValue: measureValue,
            measureFilter: measureFilter,
        }];
        return await helpers.generateApiResponse(res, `No Data found for Patient Mrn: ${patientMrn}`, 200, data);
    }

    var orderedDate = '';
    var patientMrnDetails = interventionData.response.docs[0];
    if (baaInterventionType == 3) {
        // For Medication use Medication_OrderedDate
        orderedDate = patientMrnDetails.Medication_OrderedDate;
    } else {
        // For Procedure use Procedure_OrderedDate
        orderedDate = patientMrnDetails.Procedure_OrderedDate;
    }

    // Build Solr Query for Measure
    var beforeMeasureCount = 0;
    var beforeMeasureData = '';
    var beforeMeasureDataQuery = '';
    var afterMeasureCount = 0;
    var afterMeasureData = '';
    var afterMeasureDataQuery = '';

    beforeMeasureDataQuery = helpers.baaQueryText(measureType, measureCodeName, orderedDate, patientMrn, 'BEFORE')
    propertiesObjectForBeforeMeasure = beforeMeasureDataQuery;

    // Fetch Before Intervention Data from Solr
    var { data } = await axios.get(SOLR_URL, {
        params: propertiesObjectForBeforeMeasure
    });

    const beforeInterventionData = data;

    if ((beforeInterventionData.responseHeader.status) == 400) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong while fetching before intervention data.', 400, []);
    }

    if ((beforeInterventionData.responseHeader.status) == 0) {
        if (beforeInterventionData.response.numFound > 0) {
            beforeMeasureCount = beforeInterventionData.response.numFound;
            beforeMeasureData = beforeInterventionData.response.docs;
        }
    }

    afterMeasureDataQuery = helpers.baaQueryText(measureType, measureCodeName, orderedDate, patientMrn, 'AFTER')
    propertiesObjectForAfterMeasure = afterMeasureDataQuery;

    // Fetch After Intervention Data from Solr
    var { data } = await axios.get(SOLR_URL, {
        params: propertiesObjectForAfterMeasure
    });

    const afterInterventionData = data;

    if ((afterInterventionData.responseHeader.status) == 400) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong while fetching after intervention data.', 400, []);
    }

    if ((afterInterventionData.responseHeader.status) == 0) {
        if (afterInterventionData.response.numFound > 0) {
            afterMeasureCount = afterInterventionData.response.numFound;
            afterMeasureData = afterInterventionData.response.docs;
        }
    }

    var data = [{
        analysis: true,
        patientMrn: patientMrn,
        patientName: patientName,
        interventionType: interventionType,
        interventionValue: interventionValue,
        measureType: measureTypeName,
        measureValue: measureValue,
        measureFilter: measureFilter,
        beforeMeasureDataQuery: beforeMeasureDataQuery,
        beforeMeasureCount: beforeMeasureCount,
        beforeMeasureData: beforeMeasureData,
        afterMeasureDataQuery: afterMeasureDataQuery,
        afterMeasureCount: afterMeasureCount,
        afterMeasureData: afterMeasureData,
    }];

    return await helpers.generateApiResponse(res, 'Before / After intervention data found.', 200, data);
});

router.post('/patientBeforeAfterList', async (req, res) => {
    
    var getPatientBaaList = beforeAfterAnalysisModel.getBaaList(0, '');
    var [baaRows] = await dbMysql.execute(getPatientBaaList);
    if (typeof baaRows == 'undefined' || baaRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, []);
    }

    return await helpers.generateApiResponse(res, 'BAA list found.', 200, baaRows);
});

router.post('/getVariableValues', async (req, res) => {
    var variableType = req.body.interventionType;
    if (variableType == null || variableType == '') {
        return await helpers.generateApiResponse(res, 'Error: Invalid Parameter passed.', 400, []);
    }
    var getVariableValueQuery = patientDailyQueryModel.getVariableValues(variableType);

    var resultData = [];

    if (getVariableValueQuery == '' || getVariableValueQuery == undefined) {
        return await helpers.generateApiResponse(res, 'Variable data not found.', 404, resultData);
    }

    const [variableValueRows] = await dbMysql.execute(getVariableValueQuery);
    if (typeof variableValueRows != 'undefined' && variableValueRows.length > 0) {
        resultData = variableValueRows;
    }

    return await helpers.generateApiResponse(res, 'Variable data found.', 200, resultData);
});

router.post('/getVariableRange', async (req, res) => {
    var variableType = req.body.measureType;
    if (variableType == null || variableType == '') {
        return await helpers.generateApiResponse(res, 'Error: Invalid Parameter passed.', 400, []);
    }

    var getVariableRangeDataQuery = patientDailyQueryModel.getVariableRange(variableType);

    var resultData = [];

    if (getVariableRangeDataQuery == '' || getVariableRangeDataQuery == undefined) {
        return await helpers.generateApiResponse(res, 'Variable data not found.', 404, resultData);
    }

    const [variableRangeRows] = await dbMysql.execute(getVariableRangeDataQuery);
    if (typeof variableRangeRows != 'undefined' && variableRangeRows.length > 0) {
        resultData = variableRangeRows;
    }

    return await helpers.generateApiResponse(res, 'Variable data found.', 200, resultData);
});

router.post('/patientBeforeAfterAdd', async (req, res) => {
    if (req.body.reportName == null || req.body.reportName == "" || req.body.interventionType == '' || req.body.interventionValue == '' || req.body.measureType == '' || req.body.measureValue == '') {
        return await helpers.generateApiResponse(res, 'Please select all required fields.', 400, []);
    }
    if ((req.body.measureType == 1 || req.body.measureType == 3) && req.body.variableRangeValue == '') {
        return await helpers.generateApiResponse(res, 'Variable value required.', 400, []);
    }
    var userId = req.query.user_id;
    var post = {
        baa_name: req.body.reportName,
        baa_user_id: userId,
        baa_created_timestamp: dateFormat(now, "yyyy-mm-dd h:MM:ss"),
        baa_intervention_timestamp: dateFormat(now, "yyyy-mm-dd h:MM:ss"),
        baa_active: 1,
    };

    const dbMysql2 = await dbMysql.connection();
    
    await dbMysql2.beginTransaction();
    var insertBaaQuery = beforeAfterAnalysisModel.insertBaa();
    var [baaRows] = await dbMysql2.query(insertBaaQuery, post);
    if (baaRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in creating new baa.', 400, []);
    }

    var baaId = baaRows.insertId;

    var baaInterventionType = req.body.interventionType;
    var baaInterventionCode = req.body.interventionValue;
    var baaMeasureType = req.body.measureType;
    var baaMeasureBaaId = baaId;
    var baaMeasureCode = req.body.measureValue;
    var baaMeasureValueSelected = null;
    if (req.body.measureType == 1 || req.body.measureType == 3) {
        var baaMeasureValueSelected = req.body.variableRangeValue;
    }

    var baaMeasurePost = {
        baa_intervention_type: baaInterventionType,
        baa_intervention_code: baaInterventionCode,
        baa_measure_type: baaMeasureType,
        baa_measure_baa_id: baaMeasureBaaId,
        baa_measure_code: baaMeasureCode,
        baa_measure_value_selected: baaMeasureValueSelected,
    }

    //save crieterion to DB
    var baaMeasureInsertQuery = beforeAfterAnalysisModel.insertBaaMeasure();
    var [baaMeasureRows] = await dbMysql2.query(baaMeasureInsertQuery, baaMeasurePost);
    if (baaMeasureRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in creating baa measures.', 400, []);
    }

    await dbMysql2.commit();

    await dbMysql2.release();
    
    return await helpers.generateApiResponse(res, 'Before / After Measure added successfully.', 200, []);
});

router.post('/beforeAfterEdit/:id', async (req, res) => {
    let id = req.params.id;
    let variableListObject = {};
    let variables = {};
    variableListObject.variables = []

    var getBaaForEditQuery = beforeAfterAnalysisModel.getBaaList(1, id);
    var [baaRow] = await dbMysql.execute(getBaaForEditQuery);
    if (typeof baaRow == 'undefined' || baaRow.length != 1) {
        return await helpers.generateApiResponse(res, 'No data found.', 404, []);
    }

    let baaName = baaRow[0].baa_name;
    let baaId = baaRow[0].baa_id;
    variableListObject.reportName = baaName;
    variableListObject.reportId = baaId;

    let getBaaEditCriteriaQuery = beforeAfterAnalysisModel.getMeasuredata(baaId);
    var [baaCriteriaRows] = await dbMysql.execute(getBaaEditCriteriaQuery);
    if (typeof baaCriteriaRows == 'undefined' || baaCriteriaRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'No criteria data found.', 404, []);
    }

    variables.reportMeasureId = baaCriteriaRows[0].baa_measure_id;
    variables.interventionType = baaCriteriaRows[0].baa_intervention_type;
    variables.interventionValue = baaCriteriaRows[0].baa_intervention_code;
    variables.measureType = baaCriteriaRows[0].baa_measure_type;
    variableListObject.baa_measure_baa_id = baaCriteriaRows[0].baa_measure_baa_id;
    variables.measureValue = baaCriteriaRows[0].baa_measure_code;
    variables.variableRangeValue = baaCriteriaRows[0].baa_measure_value_selected;

    var getbaaRangeData = patientDailyQueryModel.getVariableRange(baaCriteriaRows[0].baa_measure_type);
    var [baaRangeDataRows] = await dbMysql.execute(getbaaRangeData);

    variables.variableRangeData = [];

    if (typeof baaRangeDataRows != 'undefined' && baaRangeDataRows.length > 0) {
        variables.variableRangeData = baaRangeDataRows;
    }

    variableListObject.variables.push(variables);

    return await helpers.generateApiResponse(res, 'Baa Data found.', 200, [variableListObject]);
});

router.post('/patientBeforeAfterUpdate/:id', async (req, res) => {
    if (req.body.reportName == null || req.body.reportName == "" || req.body.variables.length <= 0) {
        return await helpers.generateApiResponse(res, 'Invalid Parameter passed.', 400, []);
    }
    var reportId = req.body.reportId;
    var reportName = req.body.reportName;
    var userId = req.query.user_id;
    var post = {
        baa_name: reportName,
        baa_user_id: userId,
        baa_active: 1,
    };

    const dbMysql2 = await dbMysql.connection();

    await dbMysql2.beginTransaction();
    var updateBaaById = beforeAfterAnalysisModel.updateBaaById(reportId);
    var [baaRows] = await dbMysql2.query(updateBaaById, post);
    if (baaRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in updating baa.', 400, []);
    }

    var baaId = reportId;
    var variables = req.body.variables[0];
    var baaMeasureId = variables.reportMeasureId;
    var baaInterventionType = variables.interventionType;
    var baaInterventionCode = variables.interventionValue;
    var baaMeasureType = variables.measureType;
    var baaMeasureBaaId = baaId;
    var baaMeasureCode = variables.measureValue;

    var baaMeasureValueSelected = null;
    if (baaMeasureType != 5) {
        baaMeasureValueSelected = variables.variableRangeValue;
    }

    var baaMeasurePost = {
        baa_intervention_type: baaInterventionType,
        baa_intervention_code: baaInterventionCode,
        baa_measure_type: baaMeasureType,
        baa_measure_baa_id: baaMeasureBaaId,
        baa_measure_code: baaMeasureCode,
        baa_measure_value_selected: baaMeasureValueSelected,
    }

    //save crieterion to DB
    var updateBaaMeasureQuery = beforeAfterAnalysisModel.updateBaaMeasureById(baaMeasureId);
    var [baaMeasureRows] = await dbMysql2.query(updateBaaMeasureQuery, baaMeasurePost);
    if (baaMeasureRows.affectedRows <= 0) {
        await dbMysql2.rollback();
        return await helpers.generateApiResponse(res, 'Something went wrong in updating baa measures.', 400, []);
    }

    await dbMysql2.commit();

    await dbMysql2.release();

    return await helpers.generateApiResponse(res, 'Before / After Measure updated successfully.', 200, []);

});

router.post('/beforeAfterDelete/:id', async (req, res) => {
    let baaMeasureId = req.params.id;
    var post = { baa_active: 0 };

    let deleteBaa = beforeAfterAnalysisModel.updateBaaById(baaMeasureId)
    var [deleteBaaRows] = await dbMysql.query(deleteBaa, post);
    if (typeof deleteBaaRows == 'undefined' || deleteBaaRows.length <= 0) {
        return await helpers.generateApiResponse(res, 'Error: Something went wrong.', 400, deleteBaaRows);
    }

    return await helpers.generateApiResponse(res, 'PDQ deleted successfully.', 200, []);
});

module.exports = router;