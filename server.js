const express = require('express'),
    config = require('./config/config'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    work = require('./routes/work-router'),
    user = require('./routes/user-router'),
    passport = require('passport'),
    jwtStrategy = require('./app/passport/jwt-passport'),
    helmet = require('helmet'),
    cors = require('cors'),
    security = require('./app/middleware/security-middleware'),
    app = express();

app.use(helmet());
app.use(security.policy);
//app.use(cors({ origin: 'http://seu-site.com.br' }));
//app.use(cors({origin: '*'}));

jwtStrategy();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));


app.use('/v1/api', work);
app.use('/v1/api', user);

app.use(passport.initialize());

app.listen(config.PORT, config.IP, () =>{
    console.log("Server running at " + config.IP + " port " + config.PORT);
});