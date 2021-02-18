const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
mysql.createConnection({
  multipleStatements: true
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Iek",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
  port: "8889" 
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loggedinUser = Boolean;
    const emailAddress = email;
    let userRole;
    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Lütfen kutucukları boş bırakmayınız",
        loginn: req.session.loggedinUser,
      });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        if (results.length > 0) {
          if (results[0].role == "admin") {
            req.session.adminUser = true;
          }
          if (results[0].role == "owner") {
            req.session.ownerUser = true;
          }
        }
        if (
          results == "" ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.render("login", {
            message: "Email veya şifre hatalı",
            loginn: req.session.loggedinUser,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });
        } else if(!(results[0].isVerified)) {
          res.render("login", {
            message: "Lütfen destek ekibimizin onay maili atmasını bekleyiniz",
            loginn: req.session.loggedinUser,
            adminn: req.session.adminUser,
            ownerr: req.session.ownerUser,
          });

        }else{
          const id = results[0].id;
          const token = jwt.sign({
              id: id,
            },
            process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );
          console.log("the token is :" + token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookieOptions);
          req.session.loggedinUser = true;
          req.session.emailAddress = email;
          req.session.userRole = results[0].role;
          req.session.loginname = results[0].firstname,
          req.session.loginlastname = results[0].lastname,
          console.log(req.session.userRole);
          if (req.session.userRole == "admin") {
            res.redirect("/adminMain");
          } else if (req.session.userRole == "owner") {
            res.redirect("/ownerMain");
          } else {
            res.redirect("/");
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.register = (req, res) => {
  console.log(req.body);
  const {
    name,
    lastname,
    email,
    password,
    passwordConfirm
  } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        res.render("register", {
          message: "That Email is already in use",
          loginn: req.session.loggedinUser,
        });
      } else if (password !== passwordConfirm) {
        res.render("register", {
          message: "Passwords do not match",
          loginn: req.session.loggedinUser,
        });
      } else {
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        console.log("---------------------------------------------")
        console.log(new Date());
        console.log("---------------------------------------------")
        db.query(
          "INSERT INTO users SET ? ", {
            role: "regUser",
            password: hashedPassword,
            email: email,
            firstname: name,
            lastname: lastname,
            isVerified: false,
            createDate: new Date(),
          },
          (err, results) => {
            if (error) {
              console.log(error);
            } else {
            const encryptedemail = cryptr.encrypt(email);
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
              to: email,
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
              console.log(results);
              req.session.name = name;
              req.session.lname = lastname;
              return res.redirect("/registerSuccess");
            }
          }
        );
      }
    }
  );
};

exports.contactus = (req, res) => {
  console.log("çalıştı");

  const {
    nameS,
    contactmail,
    message
  } = req.body;
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
    to: contactmail,
    subject: "Destek Talebi",
    text: "Merhabalar Sayın " +
      nameS +
      " Gönderdiğiniz mesaj destek ekiplerimiz tarafından incelemeye" +
      " alınmıştır. En kısa sürede tarafınızla iletişime geçilecektir.",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  var mailOptions = {
    from: "snolldestek@gmail.com",
    to: "snolldestek@gmail.com",
    subject: "Destek Ekibinin Dikkatine ",
    text: "Destek ekibinin dikkatine " +
      nameS +
      " isimli kullanıcı destek ekibimize şu mesajı bıraktı ----------- " +
      message +
      " --------- En kısa sürede değerlendirilip kullanıcıya geri dönülmesi gerekmektedir . İyi çalışmalar",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  req.session.contactname = nameS;
  res.redirect("/sendSuccess");
};

exports.contactus = (req, res) => {
  console.log("çalıştı");

  const {
    nameS,
    contactmail,
    message
  } = req.body;
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
    to: contactmail,
    subject: "Destek Talebi",
    text: "Merhabalar Sayın " +
      nameS +
      " Gönderdiğiniz mesaj destek ekiplerimiz tarafından incelemeye" +
      " alınmıştır. En kısa sürede tarafınızla iletişime geçilecektir.",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  var mailOptions = {
    from: "snolldestek@gmail.com",
    to: "snolldestek@gmail.com",
    subject: "Destek Ekibinin Dikkatine ",
    text: "Destek ekibinin dikkatine " +
      nameS +
      " isimli kullanıcı destek ekibimize şu mesajı bıraktı " +
      message +
      " En kısa sürede değerlendirilip kullanıcıya geri dönülmesi gerekmektedir . İyi çalışmalar",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  req.session.contactname = nameS;
  res.redirect("/contactusSuccess");
};

exports.forgetPasswordSendMail = (req, res) => {
  const {
    email
  } = req.body;
  const loggedinUser = Boolean;
  const emailAddress = email;
  let userRole;
  if (!email) {
    return res.status(400).render("forgetPassword", {
      message: "Email kısmı boş bırakılamaz",
      loginn: req.session.loggedinUser,
    });
  }
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      console.log(results);
      if (results == "") {
        req.session.message = "email sistemde kayıtlı değil";
        res.render("forgetPassword", {
          message: req.session.message,
          loginn: req.session.loggedinUser,
        });
      } else {
        const encryptedemail = cryptr.encrypt(email);
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
          to: email,
          subject: "Tebrikler",
          text: "Burada ki bağlantıyı kullanarak şifrenizi sıfırlayabilirsiniz http://localhost:3000/resetPassword/" +
            encryptedemail +
            " Bizi tercih ettiğiniz için teşekkür ederiz",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        res.redirect("/forgetSuccess");
      }
    }
  );
};