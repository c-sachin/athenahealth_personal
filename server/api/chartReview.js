const express = require("express");
const dbMysql = require("../db/dbMysql");
const helpers = require('../lib/helpers');
const router = express.Router();
const chartReviewModel = require('../models/chartReviewModel');
const SOLR_URL = process.env.SOLR_URL;
const axios = require("axios");

router.get('/patientSearch/:mrn', async (req, res) => {
    var patientmrn = req.params.mrn;
    var patientSearchQuery = chartReviewModel.patientSearch(patientmrn);
    var [patientInfo] = await dbMysql.execute(patientSearchQuery);
    if (typeof patientInfo == 'undefined' || patientInfo.length <= 0) {
        return await helpers.generateApiResponse(res, 'No record found', 404, []);
    }
    return await helpers.generateApiResponse(res, 'Patient record found.', 200, patientInfo[0]);
});

router.get('/patientSearchByName/:name', async (req, res) => {
    var patientName = req.params.name;
    var patientSearchQuery = chartReviewModel.patientSearchByName(patientName);
    var [patientInfo] = await dbMysql.execute(patientSearchQuery);
    if (typeof patientInfo == 'undefined' || patientInfo.length <= 0) {
        return await helpers.generateApiResponse(res, 'No record found', 404, []);
    }
    return await helpers.generateApiResponse(res, 'Patient record found.', 200, patientInfo);
})

router.post('/patientFilter/', async (req, res) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let body = req.body.patientBasicInfo
    var patientBasicInfo = req.body.patientBasicInfo;
    var outputArray = [];
    var systemEntryArray = []
    var imagingArray = [];
    var documentArr = [];
    var charArr = [];

    if (Object.keys(req.body).length == 0) {
        return await helpers.generateApiResponse(res, `No data found for current selection`, 404, []);
    }

    body.vitalSigns.forEach(async function (vitalSings) {
        outputArray.push(new Promise(async (resolve, reject) => {
            let object = {}
            let fq = 'Flowsheet_Name:"' + vitalSings.name + '"';
            if (vitalSings.id == 2) {
                fq = 'Flowsheet_Name:"' + vitalSings.name + '" AND Flowsheet_Description:"systolic"';
            }
            var propertiesObject = { q: 'Patient_Mrn:' + body.mrn, fq: fq };

            var { data } = await axios.get(SOLR_URL, {
                params: propertiesObject
            });

            if ((data.responseHeader.status) == 400) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                    console.log(`Error getting data from Solr for vital sign: ${vitalSings.name}`)
                });
            }

            if ((data.responseHeader.status) != 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                    console.log(`Error getting data from Solr for vital sign:: ${vitalSings.name}`)
                });
            }

            if (data.response.numFound <= 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                    console.log(`No solr data found for vital sign: ${vitalSings.name}`)
                });
            }

            if (data.response.numFound > 0) {
                let solResponse = data.response.docs;
                let resObject = await helpers.chartReviewSolrResponse(solResponse, vitalSings);
                object = resObject
                resolve(object);
            }
        }));
    });

    let vitalOutput = await Promise.all(outputArray);
    let labResult = [];
    body.systemEntries.forEach(async function (systemEntry) {
        systemEntryArray.push(new Promise(async (resolve, reject) => {
            let object = {}
            let fq = 'PatientClass:"' + systemEntry.value + '"';
            if (systemEntry.value === "Labs") {
                fq = 'LabComponent_Name:* OR Flowsheet_Name:Stool OR Flowsheet_Name:Urine';
            }
            var propertiesObject = { q: 'Patient_Mrn:' + body.mrn, fq: fq, rows: "100" };
            var { data } = await axios.get(SOLR_URL, {
                params: propertiesObject
            });

            if ((data.responseHeader.status) == 400 || (data.responseHeader.status) != 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                });
            }

            if (data.response.numFound == 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                    console.log(`No Solr data found for system entries: ${systemEntry.value}`);
                });
            }

            let solResponse = data.response.docs;
            solResponse.forEach(async (item) => {
                (systemEntry.value == "Inpatient") ? object.systemEntryTime = helpers.dateFromatForChartReview(item.AdmissionDate) : object.systemEntryTime = helpers.dateFromatForChartReview(item.DischargeDate)
                object.systemEntryName = systemEntry.value
                if (systemEntry.value === 'Labs') {
                    let labData = await helpers.systemEntryLabsSolrResponse(item, systemEntry);
                    labResult.push(labData);
                    object.value = labResult;
                }
            })
            resolve(object)
        }))
    });

    let systemEntryOutput = await Promise.all(systemEntryArray);
    var imagingData = body.imagingData;
    imagingData.forEach(async function (filterVal) {
        let objectimaging = {};
        imagingArray.push(new Promise(async (resolve, reject) => {
            var filterQuery = "Name1:" + filterVal.name + " OR Name2: " + filterVal.name + " OR Name3: " + filterVal.name + " OR Name4: " + filterVal.name;
            var propertiesObject = {
                q: "Patient_Mrn:" + patientBasicInfo.mrn,
                fq: filterQuery
            };
            var { data } = await axios.get(SOLR_URL, {
                params: propertiesObject
            });

            if (data.responseHeader.status == 400 || data.responseHeader.status != 0 || data.response.numFound <= 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(objectimaging)
                ).catch(e => {
                    console.log(`Error getting data from Solr for imaging: ${filterVal.name}`);
                });
            }

            if (data.response.numFound > 0) {
                let solResponse = data.response.docs;
                imagingType = filterVal.name;
                objectimaging = {
                    note: solResponse[0].Name1,
                    type: imagingType,
                    dateAndTime: helpers.dateFromatForChartReview(solResponse[0].Created_on)
                }
                resolve(objectimaging);
            }
        }));
    });

    var imagingResult = await Promise.all(imagingArray);
    var documentType = body.documentTypeData;
    documentType.forEach(async function (filterVal) {
        let object = {};
        documentArr.push(new Promise(async (resolve, reject) => {
            var filterQuery = "Name1:" + filterVal.name + " OR Name2: " + filterVal.name + " OR Name3: " + filterVal.name + " OR Name4: " + filterVal.name;
            var propertiesObject = {
                q: "Patient_Mrn:" + patientBasicInfo.mrn,
                fq: filterQuery
            };
            var { data } = await axios.get(SOLR_URL, {
                params: propertiesObject
            });

            if (data.responseHeader.status == 400 || data.responseHeader.status != 0 || data.response.numFound <= 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                    console.log(`Error getting data from Solr for document: ${filterVal.name}`);
                });
            }

            if (data.response.numFound > 0) {
                let solResponse = data.response.docs;
                type = filterVal.name;
                object = {
                    note: solResponse[0].Name1,
                    type: type,
                    dateAndTime: helpers.dateFromatForChartReview(solResponse[0].Created_on)
                }
                resolve(object);
            }
        }));
    });

    var documentResult = await Promise.all(documentArr);
    if (body.charData.length > 0) {
        var charData = body.charData;
        var filterQuery = '';
        var object = {};
        charData.forEach(async function (filterVal) {
            if (filterVal.name === "Past Medical History") {
                filterQuery += " Medical_Problem:* OR";
            }
            if (filterVal.name === "Allergies") {
                filterQuery += " AllergyName:* OR";
            }
            if (filterVal.name === "Birth History") {
                filterQuery += " Patient_First_Name:* OR";
            }
            if (filterVal.name === "Surgical History") {
                filterQuery += " PrimaryService:* OR";
            }
            if (filterVal.name === "Medications taken") {
                filterQuery += " (Medication_Name:* OR Medication_Quantity:*) OR";
            }
            if (filterVal.name === "Social history") {
                filterQuery += " Category:Social History OR";
            }
        })

        filterQuery = await filterQuery.substring(0, filterQuery.lastIndexOf(" OR"));
        var propertiesObject = {
            q: "Patient_Mrn:" + patientBasicInfo.mrn,
            fq: filterQuery,
            rows: "36"
        };

        charArr.push(new Promise(async (resolve, reject) => {
            var { data } = await axios.get(SOLR_URL, {
                params: propertiesObject
            });

            if (data.responseHeader.status == 400 || data.responseHeader.status != 0 || data.response.numFound <= 0) {
                Promise.reject(new Error('fail')).then(
                    resolve(object)
                ).catch(e => {
                    console.log(`Error getting data from Solr for characteristics: ${propertiesObject}`);
                });
            }

            if (data.response.numFound > 0) {
                let solResponse = data.response.docs;
                var charAllData = [];
                let innerData = {};
                let innerDataMedication = [];
                let innerDataMedicalHistory = []
                solResponse.map(innerElement => {
                    if (innerElement.Patient_DOB) {
                        innerData.dob = '';
                    }
                    if (innerElement.PrimaryService) {
                        innerData.surgicalhistory = innerElement.PrimaryService;
                    }
                    if (innerElement.Medication_Name || innerElement.Medication_Quantity) {
                        let Medication_StartDate = (innerElement.Medication_StartDate) ? helpers.dateFromatForChartReview(innerElement.Medication_StartDate) : '';
                        let obj = {
                            MedicationStartDate: Medication_StartDate,
                            MedicationName: (innerElement.Medication_Name) ? innerElement.Medication_Name : '',
                            MedicationQuantity: (innerElement.Medication_Quantity) ? innerElement.Medication_Quantity : 0,
                            MedicationDoseUnit: (innerElement.Medication_DoseUnit) ? innerElement.Medication_DoseUnit : ''
                        };
                        innerDataMedication.push(obj);
                        innerData.medicationtaken = innerDataMedication;
                    }
                    if (innerElement.AllergyName) {
                        innerData.allergy = {
                            allergyName: innerElement.AllergyName,
                            allergyReaction: innerElement.AllergyReaction,
                            allergyType: innerElement.AllergyType
                        };
                    }
                    if (innerElement.Smoking_Status) {
                        innerData.socialhistory = {
                            SmokingStatus: (innerElement.Smoking_Status) ? innerElement.Smoking_Status : '',
                            drinkAlcohol: (innerElement.Drink_Alcohol) ? innerElement.Drink_Alcohol : '',
                        };
                    }
                    if (innerElement.Medical_Problem) {
                        let obj = {
                            Immunization: (innerElement.Medical_Problem) ? innerElement.Medical_Problem : '',
                            Condition: (innerElement.DiagnosisKey) ? innerElement.DiagnosisKey : '',
                        };

                        innerDataMedicalHistory.push(obj);
                        innerData.medicalhistory = innerDataMedicalHistory;
                    }
                });

                charAllData.push(innerData);
                let objectMedication = { MedicationTaken: innerData.medicationtaken };
                let objectAllergy = { allergy: innerData.allergy };
                let objectSurgialHistory = { surgicalHistory: innerData.surgicalhistory };
                let objectMedicalHistory = { MedicalHistory: innerData.medicalhistory };
                let objectSocialHistory = { SocialHistory: innerData.socialhistory };
                charAllData[0] = objectMedicalHistory;
                charAllData[1] = objectMedication;
                charAllData[2] = objectAllergy;
                charAllData[3] = objectSurgialHistory;
                charAllData[4] = objectSocialHistory;

                object.data = charAllData
                resolve(object);
            }
        }));
    } else {
        console.log(`No checkbox selected for characteristics`);
    }

    var charResult = await Promise.all(charArr);
    let output = {
        vitalOutput: vitalOutput,
        systemEntryOutput: systemEntryOutput,
        charResult: charResult,
        documentResult: documentResult,
        imagingResult: imagingResult,
    };

    return await helpers.generateApiResponse(res, 'Chart review data Data found.', 200, output);
});

module.exports = router;
