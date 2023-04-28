require('dotenv').config();
import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import session from "express-session";
import connectFlash from "connect-flash";
import passport from "passport";

let app = express();

//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

// Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Config view engine
configViewEngine(app);

//Enable flash message
app.use(connectFlash());

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));

var createError = require('http-errors')
var flash = require('express-flash')
var logger = require('morgan')
var path = require('path')
var db = require('./config/database')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.get('/home', function (req, res, next) {
  res.render('index', { title: 'User Form' })
})


//Route
var dataRoute = require('./routes/data')
var tableRoute = require('./routes/table')

//route use 
app.use('/export', dataRoute)
app.use('/data', tableRoute)

app.post('/user_form', function (req, res, next) {
  var CAP = req.body.CAP
  var ML = req.body.ML
  var GEN = req.body.GEN
  var ACM = req.body.ACM
  var PS = req.body.PS 
  var ACP = req.body.ACP
  var GM = req.body.GM
  var GP = req.body.GP
  var PS = req.body.PS
  var TACM = req.body.TACM
  var TACP = req.body.TACP
  var USOM = req.body.USOM
  var PLF = req.body.PLF
  var CCM = req.body.CCM
  var CCA = req.body.CCA 
  var RCO = req.body.RCO
  var RCV = req.body.RCV
  var LC = req.body.LC
  var CC = req.body.CC
  var sql = `INSERT INTO final_data (POWER_STATION, date, CAP, MAX_LOAD, AUX_CONS, AUX_CONS_PR, GTLOSS, GTLOSS_PR, TOTAL_AUX_CONS_PR, UNIT_SENT_OUT, PLF, COAL_CONS, COAL_CV, RFO_CONS, RFO_CV, LDO_CV, COAL_CV_AR) VALUES ("${PS}", CURDATE(), "${CAP}", "${ML}", "${ACM}", "${ACP}", "${GM}", "${GP}", "${TACP}", "${USOM}", "${PLF}", "${CCM}", "${CCA}", "${RCO}", "${RCV}", "${LC}", "${CC}")`
  db.query(sql, function (err, result) {
    if (err) throw err
    console.log('Row has been updated')
    req.flash('success', 'Data stored!')
    res.redirect('/home')
  })
})


app.use(function (req, res, next) {
  next(createError(404))
})
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
