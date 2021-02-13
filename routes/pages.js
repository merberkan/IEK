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
  database: process.env.DATABASE,
});

router.get("/", (req, res) => {
  res.render("index", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    name: req.session.loginname,
    lastname:req.session.loginlastname,
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
    lastname:req.session.loginlastname,
  });
});

router.get("/Useragreement", (req, res) => {
  res.render("Useragreement", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname:req.session.loginlastname,
  });
});

router.get("/UserPanel", (req, res) => {
  db.query("SELECT * FROM iek.Users", async (err, result) => {
    const Users = [];
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var a = {
          role: result[i].role,
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
      lastname:req.session.loginlastname,
    });
  });
});

router.get("/aboutus", (req, res) => {
  res.render("aboutus", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname:req.session.loginlastname,
  });
});

router.get("/privacypolicy", (req, res) => {
  res.render("privacypolicy", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname:req.session.loginlastname,
  });
});
router.get("/events", (req, res) => {
  res.render("events", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
    adminn: req.session.adminUser,
    name: req.session.loginname,
    lastname:req.session.loginlastname,
    ownerr: req.session.ownerUser,
  });
});

router.get("/profile", async (req, res) => {
  if (req.session.emailAddress) {
    const Detail = [];
    db.query(
      "SELECT * FROM Users join Ticket ON Users.email = Ticket.user_email",
      [req.session.emailAddress],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].email == req.session.emailAddress) {
              var a = {
                ticket_id: result[i].ticket_id,
                event_name: result[i].event_name,
              };
              Detail.push(a);
            }
          }
        }
      }
    );
    db.query(
      "SELECT * FROM Users WHERE Users.email = ?",
      [req.session.emailAddress],
      (err, result) => {
        const User = [];
        if (err) {
          console.log(err);
        }
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            var x = [
              {
                firstname: result[i].firstname,
                lastname: result[i].lastname,
                email: result[i].email,
                role: result[i].role,
              },
            ];
            User.push(x);
          }
          var length = User.length;
          for (var j = 0; j < length - 1; j++) {
            console.log(j, User.length);
            User.pop();
          }

          res.render("profile", {
            User,
            Detail,
            email: req.session.emailAddress,
            loginn: req.session.loggedinUser,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        }
      }
    );
  } else {
    res.redirect("/notFound");
  }
});

router.get("/registerSuccess", (req, res) => {
  res.render("registerSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.name,
    lastname: req.session.lname,
  });
});
router.get("/members", (req, res) => {
  res.render("members", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.loginname,
    lastname: req.session.loginlastname,
  });
});

router.get("/members2", (req, res) => {
  res.render("members2", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    name: req.session.name,
    lastname: req.session.lname,
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
            }else{
        res.render("activeSuccess", {
          loginn: req.session.loggedinUser,
          name:result[0].firstname,
          lastname:result[0].lastname,
        });
      }
    });
      }
    }
    
  );
  
});

router.get("/contactusSuccess", (req, res) => {
  res.render("contactusSuccess", {
    loginn: req.session.loggedinUser,
    email: req.session.emailAddress,
    contactname: req.session.contactname,
  });
});

router.get("/notFound", (req, res) => {
  res.render("notFound", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});
router.get("/sendSuccess", (req, res) => {
  res.render("sendSuccess", {
    email: req.session.emailAddress,
    loginn: req.session.loggedinUser,
  });
});

//Easter Egg
router.get("/PandanınPanı", (req, res) => {
  const encryptedString = cryptr.encrypt("Pandanın_Panı_Atılayın_Amı");
  console.log(encryptedString);
  const decryptedString = cryptr.decrypt(encryptedString);
  console.log(decryptedString);

  console.log("Şile soğuktur xd");

  res.redirect("/");
});
module.exports = router;
