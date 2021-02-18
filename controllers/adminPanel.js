const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
mysql.createConnection({ multipleStatements: true });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
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

