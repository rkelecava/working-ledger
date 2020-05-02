var express = require('express'),
    config = require('./config/index.config'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    http = require('http'),
    mongoose = require('mongoose');


// Mongoose database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.db, function (err) {
    if (err) {
        console.log(err);
        process.exit();
    }
});

var app = express();

// Set the port
var port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set assets folder
app.use(express.static(path.join(__dirname, 'assets')));

// Log with morgan
app.use(logger('dev'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Cookie parser middleware
app.use(cookieParser());

// Routes
// Client
app.use('/', require('./routes/client/index.routes'));
// API
app.use('/api', require('./routes/api/index.routes'));


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = http.createServer(app)
    .listen(port)
    .on('error', onError)
    .on('listening', onListening);

// Normalize port into a number, string, or false
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific errors with friendly messages
    switch(error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}