const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get("/", (req, res) => {
  res.render("index", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});
router.get("/register", (req, res) => {
  res.render("register", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    message: req.session.message,
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});

router.get("/forgetPassword", (req, res) => {
  res.render("forgetPassword", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    message: req.session.message,
  });
});

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

router.get("/contactus", (req, res) => {
  res.render("contactus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/Useragreement", (req, res) => {
  res.render("Useragreement", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/UserPanel", (req, res) => {
  if(req.session.adminUser && req.session.loggedinUser){
    db.query("SELECT * FROM iek.Users", async (err, result) => {
      const Users = [];
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          var a = {
            role: result[i].role,
            firstname: result[i].firstname,
            lastname: result[i].lastname,
            email: result[i].email,
            id: result[i].id,
          };
          Users.push(a);
        }
      }
      res.render("UserPanel", {
        Users,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        name: req.session.loginname,
        lastname: req.session.loginlastname,
      });
    });
  }else {
    res.redirect("/notFound");
  }
  
});

router.get("/userdelete/:mail", (req, res) => {
  const path = req.params.mail;
  db.query("DELETE FROM Users Where email = ?", [path], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/UserPanel");
  });
});

router.get("/setAdmin/:mail", (req, res) => {
  const path = req.params.mail;
  db.query(
    "UPDATE  Users SET role = 'admin' Where email = ?",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/UserPanel");
    }
  );
});

router.get("/setUser/:mail", (req, res) => {
  const path = req.params.mail;
  db.query(
    "UPDATE  Users SET role = 'regUser' Where email = ?",
    [path],
    (err, result) => {
      if (err) {
        res.render("notFound", {
          messages,
          capacityControl,
          dateControl,
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
          adminn: req.session.adminUser,
          ownerr: req.session.ownerUser,
        });
      }
      res.redirect("/UserPanel");
    }
  );
});

router.get("/events", (req, res) => {
  db.query("SELECT * FROM Iek.Events", async (err, result) => {
    const EventsArray = [];
    if (err) {
      res.render("notFound", {
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        ownerr: req.session.ownerUser,
      });
    } else {
      for (var i = 0; i < result.length; i++) {
        var a = {
          EventName: result[i].EventName,
          EventPhoto: result[i].EventPhoto,
          EventFull: result[i].EventFull,
          EventSummary: result[i].EventSummary,
        };
        EventsArray.push(a);
      }
      res.render("events", {
        EventsArray,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        name: req.session.loginname,
        lastname: req.session.loginlastname,
      });
    }
  });
});

router.get("/events/:name", (req, res) => {
  var path = req.params.name;
  db.query(
    "SELECT * FROM Iek.Events WHERE Iek.Events.EventName= ? ",
    [path],
    (err, result) => {
      if (err) {
        res.render("notFound", {
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
          adminn: req.session.adminUser,
          name: req.session.loginname,
          lastname: req.session.loginlastname,
        });
      } else {
        const Event = [
          {
            EventName: result[0].EventName,
            EventPhoto: result[0].EventPhoto,
            EventFull: result[0].EventFull,
            EventSummary: result[0].EventSummary,
          },
        ];
        console.log(Event);
        res.render("events2", {
          Event,
          email: req.session.emailAddress,
          loginn: req.session.loggedinUser,
          adminn: req.session.adminUser,
          name: req.session.loginname,
          lastname: req.session.loginlastname,
        });
      }
    }
  );
});

router.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/registerSuccess", (req, res) => {
  res.render("registerSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.name,
    lastname: req.session.lname,
  });
});
router.get("/yonetim", (req, res) => {
  res.render("yonetim", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/calisma", (req, res) => {
  res.render("calisma", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/sendProveMail/:email", (req, res) => {
  const path = req.params.email;
  const encryptedemail = cryptr.encrypt(path);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "snolldestek@gmail.com",
      pass: "snoll123",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: "snolldestek@gmail.com",
    to: path,
    subject: "Tebrikler",
    text:
      "Destek ekibimiz tarafından üyeliğiniz kabul edilmiştir bu bağlantıya tıklayarak üyeliğinizi aktifleştirebilirsiniz http://localhost:3000/activateUser/" +
      encryptedemail +
      "  İşletme ve Ekonomi kulübü ailesine hoşgeldiniz.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.redirect("/sendSuccess");
});

router.get("/activateUser/:mail", async (req, res) => {
  const path = req.params.mail;
  const decryptedEmail = cryptr.decrypt(path);
  db.query(
    "UPDATE users SET isVerified= true where email = ? ",
    [decryptedEmail],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        db.query(
          "SELECT * FROM Users WHERE Users.email = ?",
          [decryptedEmail],
          (err, result) => {
            const User = [];
            if (err) {
              console.log(err);
            } else {
              res.render("activeSuccess", {
                loginn: req.session.loggedinUser,
                name: result[0].firstname,
                lastname: result[0].lastname,
              });
            }
          }
        );
      }
    }
  );
});

router.get("/contactusSuccess", (req, res) => {
  res.render("contactusSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/notFound", (req, res) => {
  res.render("notFound", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.loginname,
    adminn: req.session.adminUser,
    lastname: req.session.loginlastname,
  });
});
router.get("/sendSuccess", (req, res) => {
  res.render("sendSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});
router.get("/adminMain", (req, res) => {
  if(req.session.adminUser && req.session.loggedinUser){
    res.render("adminMain", {
      email: req.session.emailAddress,
      loginn: req.session.loggedinUser,
      adminn: req.session.adminUser,
      name: req.session.loginname,
      lastname: req.session.loginlastname,
    });
  }else{
    res.redirect("/notFound");
  }
});
router.get("/EventPanel", (req, res) => {
  if(req.session.adminUser && req.session.loggedinUser){
    db.query("SELECT * FROM Events", (err, results) => {
      const Events = [];
      if(err){
        res.redirect("/notFound")
      }
      if(results.length > 0){
        let event;
        for (let index = 0; index < results.length; index++) {
          event = {
            EventID : results[index].EventID,
            EventName : results[index].EventName,
            EventPhoto : results[index].EventPhoto,
            EventFull : results[index].EventFull,
            EventSummary : results[index].EventSummary
          };
          
          Events.push(event);
        };
      };
      res.render("EventPanel", {
        Events,
        email: req.session.emailAddress,
        loginn: req.session.loggedinUser,
        adminn: req.session.adminUser,
        name: req.session.loginname,
        lastname: req.session.loginlastname,
      });
    });
  }else{
    res.redirect("/notFound");
  }
  
});
router.get("/eventdeleteasadmin/:id", (req, res) =>{
  const path = req.params.id;
  db.query(
    "DELETE FROM Events Where EventID = ?",
    [path],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/EventPanel");
    }
  );
});

module.exports = router;
