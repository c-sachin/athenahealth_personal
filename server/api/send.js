var mysql = require('mysql');
var db = 'db_athena';

const helpers = require('../lib/helpers');
const axios = require("axios");
var https = require('https')

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

var table = ('select * from m_department');

connection.query('CREATE DATABASE IF NOT EXISTS ??', db, function(err, results) {
  if (err) {
    console.log('error in creating database', err);
    return;
  }

  console.log('created a new database');

  connection.changeUser({
    database : db
  }, function(err) {
    if (err) {
      console.log('error in changing database', err);
      return;
    }

    var a = connection.query(table, function(err,results) {
      if (err) {
        console.log('error in creating tables', err);
        return;
      }

      console.log('created a new table');
      departRows = JSON.parse(JSON.stringify(results));
      console.log(usersRows);
    });
  });
});

module.exports = connection;