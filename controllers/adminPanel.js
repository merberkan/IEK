const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
mysql.createConnection({ multipleStatements: true });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Iek",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
    port: "8889" 
});

exports.event = (req, res) => {
    try {
        const {EventName,EventPhoto,EventFull,EventSummary} = req.body;

    db.query('INSERT INTO Events SET ?',{
        EventName: EventName,
        EventPhoto: EventPhoto,
        EventFull: EventFull,
        EventSummary: EventSummary
    }, (err, results) => {
        if(err){
            return res.redirect("/notFound");
        }else{
            return res.redirect("/EventPanel");
        }
    });
    } catch (error) {
        return res.redirect("/notFound");
    }
};

