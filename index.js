// load dotenv library
require('dotenv').load();
// get mongoose user and document model and config file
var User      = require('./server/models/document.model'),
    Document  = require('./server/models/user.model'),
    config    = require('./server/config/config'),

    // get packages
    express   = require('express'),
    app       = express(),

    // get an instance of the router
    router         = express.Router(),
    session        = require('express-session'),
    bodyParser     = require('body-parser'),
    // the session is stored in a cookie, so we use this to parse it
    mongoose       = require('mongoose'),
    methodOverride = require('method-override'),
    routes         = require('./server/routes'),
    morgan         = require('morgan'),

    // will listen to an appropriate port or default to port 3000
    port = process.env.PORT || 3000;

/**
 * connect to database
 * database url comes from config file
 */
mongoose.connect(config.database);

app.use(express.static(__dirname + '/public')); 

// render jade view
app.set('views', './server/views');
app.set('view engine', 'jade');
app.set('trust proxy', 1); // trust first proxy
// use body Parser so we can get info from POST and/or other URL parameters
app.use(bodyParser.urlencoded({ extended : true }));
// support json encoded bodies
app.use(bodyParser.json());

app.use(session({
  name: 'session',
  resave: false,
  saveUninitialized: true,
  secret: config.key
}));

/** [route to render a message] */
router.get('/', function(req, res) {
  res.render('welcome', { title : 'API V1', message : 'API V1! enjoy!' });
});

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(methodOverride());

// apply the routes to our application with the prefix /api
app.use('/api', router);
routes(router);

app.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/public/index.html'); // load the single view file (angular will handle the page changes on the front end)
});

// start the server
app.listen(port, function() {
  console.log('Success: http://localhost:%d', port);
});