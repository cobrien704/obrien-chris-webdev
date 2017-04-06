var express      = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var passport     = require('passport');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({ secret: 'abc',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require("./assignment/app.js")(app);

var port = process.env.PORT || 3000;

app.listen(port);