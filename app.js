const createError = require('http-errors');
const express     = require('express');
const logger      = require('morgan');
const bodyParser  = require('body-parser');
const helmet      = require('helmet')
const compress      = require('compression');

const mountRoutes = require('./routes')

var app = express();
app.use(compress());
app.use(helmet({noCache: false}));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit:'1mb',extended: true }));
app.use(bodyParser.json({limit:'1mb'})); // for parsing application/json
/* const options = {
  dotfiles: 'ignore',
  extensions: ['html'],
  index: "index.html"
}
app.use(express.static('public',options));
app.use('/uploads', express.static('uploads')); */

mountRoutes(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  //console.log(req);
  console.error('Error handler',err);
  const msg = {
    result:"err",
    message: err.message
  }
  res.status(err.status || 500).send(msg);
});

module.exports = app;
