
/**
 * Module dependencies.
 */

var _ = require('underscore');

var express = require('express')
var routes = require('./routes/index.js');
  routes = _.extend(routes, require('./routes/chkout.js'));
  routes = _.extend(routes, require('./routes/orders.js')); // HW Template
  routes = _.extend(routes, require('./routes/printOrder.js')); // HW Template

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/index', routes.index);
app.get('/chkout', routes.chkout);
app.get('/orders', routes.orders);
app.get('/printOrder', routes.printOrder);

app.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
