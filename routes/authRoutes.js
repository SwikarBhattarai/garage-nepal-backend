const passport = require('passport')
var User = require('../models/User')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer')
const client = require('twilio')(keys.accountSID, keys.authToken)
module.exports = (app) => {
  //Sign up
  app.get('/auth/signup', (req, res) => {
    if (req.body.phonenumber && req.body.name && req.body.password) {
      client.verify
        .services(keys.serviceID)
        .verifications.create({
          to: `+977${req.body.phonenumber}`,
          channel: 'sms',
        })
        .then((data) => {
          res.status(200).send({
            message: 'Verification code has been sent to' + `977${req.body.phonenumber}`,
            phonenumber: req.body.phonenumber,
            data,
          })
        })
    } else {
      res.status(400).send({
        message: 'Wrong phone number.',
        phonenumber: req.body.phonenumber,
      })
    }
  })

  // Verify Endpoint
  app.get('/verify', async (req, res) => {
    if (req.body.phonenumber && req.body.name && req.body.code.length === 4 && req.body.password) {
      const data = await client.verify.services(process.env.SERVICE_ID).verificationChecks.create({
        to: `+977${req.body.phonenumber}`,
        code: req.body.code,
      })

      if (data.status === 'approved') {
        if (await User.findOne({ phonenumber: req.body.phonenumber })) {
          res.status(400).send({
            message: req.body.phonenumber + 'has been already registered. Please try a new one.',
          })
        }

        const newUser = {
          name: req.body.name,
          hash: req.body.password,
          phonenumber: req.body.phonenumber,
          location: '',
          service: [],
        }

        if (req.body.password) {
          user.password = bcrypt.hashSync(userParam.password, 10)
        }

        var user = await new User(newUser).save((error) => {
          if (error) res.send('We are having some problems. Please try again later.')
          else {
            res.status(200).send({
              message: 'Registration was Successful. You may now login to use our app.',
              data,
            })
          }
        })
      } else {
        res.status(400).send({
          message: 'Wrong Code. Please try again.',
          phonenumber: req.body.phonenumber,
          data,
        })
      }
    } else {
      res.status(400).send({
        message: 'Wrong Code. Please try again.',
        phonenumber: req.body.phonenumber,
        data,
      })
    }
  })

  //LOGIN

  app.post('/authenticate', async (req, res) => {
    const user = await User.findOne({ phonenumber: req.body.phonenumber })
    if (user && bcrypt.compareSync(req.body.password, user.hash)) {
      const token = jwt.sign({ sub: user.id }, config.secret, {
        expiresIn: '7d',
      })
      if (token) {
        res.status(200).send({
          ...user.toJSON(),
          token,
        })
      }
    }
  })

  app.post('/sendMail', async (req, res) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'swikarbh@gmail.com',
        pass: 'dvanejxkqcpjdtue',
      },
    })

    var text = ''

    var mailOptions = {
      from: 'swikarbh@gmail.com',
      to: 'swikar6@gmail.com',
      subject: 'NEW EMAIL FROM GARAGE NEPAL USER',
      text: `${req.body}`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).send({
          response: { error: true },
        })
      } else {
        res.status(200).send({
          response: { success: true },
        })
      }
    })
  })

  // app.get(
  //   "/auth/google",
  //   passport.authenticate("google", {
  //     scope: [
  //       "profile",
  //       "email",
  //       "https://www.googleapis.com/auth/userinfo.profile"
  //     ]
  //   })
  // );

  // app.get(
  //   "/auth/google/callback",
  //   passport.authenticate("google"),
  //   (req, res) => {
  //     res.redirect("/home");

  //     if (req.user) {
  //       if (req.user.googleId === "113619158447403380554") {
  //         console.log("Admin");
  //         req.user.isAdmin = true;
  //         req.user.save();
  //       }
  //     }
  //   }
  // );

  // app.post("/api/addTeacher", async (req, res) => {
  //   console.log("teacher", req.body);
  //   res.send(req.body);
  //   var newUser = await new User({
  //     isTeacher: true,
  //     name: req.body.teacher.name,
  //     teacherEmail: req.body.teacher.email,
  //     password: req.body.teacher.password
  //   }).save(error => {
  //     if (error) console.log(error);
  //     else {
  //       res.send(newUser);
  //     }
  //   });
  // });

  // app.post(
  //   "/api/auth",
  //   passport.authenticate('local'),
  //   async (req, res) => {
  //     console.log('api', req.user)
  //     if(req.user){
  //       res.send(req.user);
  //     }else{
  //       res.redirect('/')
  //     }

  //   }
  // );

  // app.get("/api/fetchTeachers", async (req, res) => {
  //   User.find({ isTeacher: true }, "name email", function(err, teacher) {
  //     if (err) return handleError(err);
  //     else {
  //       res.send(teacher);
  //     }
  //   });
  // });

  // app.get("/api/logout", (req, res) => {

  //   req.logout();
  //   req.session=null;
  //   res.redirect("/")
  // });

  // app.get("/api/current_user", (req, res) => {
  //   res.send(req.user);
  // });

  // app.post(`/api/current_user/update`, async (req, res) => {
  //   req.user.credits = req.body.amount;
  //   const user = await req.user.save();
  //   res.send(user);
  // });
}
