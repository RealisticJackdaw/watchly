var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    expressSession = require('express-session'),
    helpers     = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var userRouter = express.Router();
  var incidentRouter = express.Router();
  var session = { path: '/',
                httpOnly: true,
                secure: false,
                secret: 'town watch',
                cookie: {maxAge: 60000, secure: false},
                maxAge: 60000,
                userid: null,
                resave: false,
                saveUninitialized: true
              };

  app.use(morgan('dev'));
  app.use(expressSession(session));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../www'));


  // app.use('/', function (req, res, next){
  //   res.send(index.html);
  // });

  app.use('/api/users', userRouter); // use user router for all user request

  // authentication middleware used to decode token and made available on the request
  // app.use('/api/incidents', helpers.decode);
  app.use('/api/incidents', incidentRouter); // user link router for link request
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('../users/userRoutes.js')(userRouter);
  require('../incidents/incidentRoutes.js')(incidentRouter);
};
