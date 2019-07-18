require('dotenv').config();
const express = require("express");
const dbMssql = require("../../db/dbMssql");
const Solr = require("../../models/solr");

var sqlQuery = Solr.getDiagnosisMasterCount();

var res = dbMssql.executeCountQuery(sqlQuery, 'Diagnosis_master');
