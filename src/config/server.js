const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('../../passport/passport')(passport);

const app = express();

//middlewar
app.use(cookieParser());
app.use(session({
    secret: 'familiasagrada',
    reseave: true,
    saveUninitialized: false
}))
app.use(flash());
app.use(bodyParser.urlencoded({ extends: false }))
app.use(express.static(path.join(__dirname, '../../src/public')));

app.use(passport.initialize());
app.use(passport.session());


//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../app/views'));


module.exports = app;