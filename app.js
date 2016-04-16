var express = require('express')
var app = express()
var path = require('path');
var cookieParser = require('cookie-parser');
var util = require('util');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 
app.use(cookieParser());

// How to use a separated router: express.Router
var birds = require('./birds');
// Véase http://expressjs.com/api.html#app.use
// Es posible usar regexp en el path
app.use('/birds', birds);  // mount the sub app

// a middleware mounted on /usuario/:id; will be executed for any type of HTTP request to /usuario/:id
// visit: http://localhost:3000/usuario/casiano
app.use('/usuario/:id', function (req, res, next) {
  console.log('Request Type:', req.method);   // GET
  console.log('Request Path:', req.path);     // /
  console.log('Request Host:', req.hostname); // localhost
  console.log('Request IP:', req.ip);         // 127.0.0.1
  console.log('Request cookies:', req.cookies); // { request_method: 'GET', ...
  console.log('req.params.id: '+(req.params.id)); // req.params.id: casiano
  next();
});

// a route and its handler function (middleware system) which handles GET requests to /usuario/:id
app.get('/usuario/:id?', function (req, res, next) {
  console.log(req.params);
  res.send('USUARIO: '+(req.params.id || 'unknown' ));
});

// a middleware sub-stack which handles GET requests to /chuchu/:id
app.get('/chuchu/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// handler for /chuchu/:id which prints the chuchu id
app.get('/chuchu/:id', function (req, res, next) {
  // res.end([data] [, encoding])
  // Ends the response process. 
  res.end(req.params.id);
});

// a middleware sub-stack which handles GET requests to /tata/:idx
app.get('/tata/:idx', function (req, res, next) {
  // if tata idx is 0, skip to the next route
  if (req.params.idx == 0) next('route');
  // else pass the control to the next middleware in this stack
  else next(); // 
}, function (req, res, next) {
  // render a regular page
  res.send('regular');
});

// handler for /tata/:idx which renders a special page
app.get('/tata/:idx', function (req, res, next) {
  res.send('special');
});

// Véase http://expressjs.com/api.html#app.param
/*
 * app.param([name], callback)
 If name is an array, the callback trigger is registered for each parameter declared in it, in the order in which they are declared. 
 Furthermore, for each declared parameter except the last one, a call to next inside the callback will call the callback for the next declared parameter. For the last parameter, a call to next will call the next middleware in place for the route currently being processed, just like it would if name were just a string.
*/
app.param('idx', function (req, res, next, idx) {
  console.log('CALLED ONLY ONCE '+req.params.idx);
  next();
});

// route with two callbacks
app.get('/example/b', function (req, res, next) {
  console.log('response will be sent by the next function ...')
  console.log(req.query);
  next();
}, function (req, res) {
  res.send('Hello from B!')
});

// respond with "Hello World!" on the homepage
app.get('/', function (req, res) {
  res.send('Got a GET request'+
    '<br/><img src="images/kitten.jpg" />'
  );
})

/* regexp: visit pruebaregexp/dragonfly */
app.get(/pruebaregexp\/.*fly$/, function(req, res) {
  console.log(`req.url = ${util.inspect(req.url, null)}`);
  res.send(`<h1>You visited <i>${req.url}</i></h1>`);
});

//json
app.get('/json', function(req, res) {
  // Sends a JSON response. 
  // This method is identical to res.send() with an object or array as the parameter. 
  // However, you can use it to convert other values to JSON, such as null, and undefined. 
  // (although these are technically not valid JSON).)
  res.json({ user: 'tobi'});
});

// another way to respond with json
app.get('/json2', function(req, res) {
  // When the parameter is an Array or Object, Express responds with the JSON representation:
  res.send({ some: 'json' });
});

//download a file
app.get('/download', function (req, res) {
  res.download("public/images/kitten.jpg");
})

// accept POST request on the homepage
app.post('/', function (req, res) {
  console.log(req.body);
  res.send('Got a POST request');
})

// accept PUT request at /user
app.put('/user', function (req, res) {
  res.send('Got a PUT request at /user');
})

// accept DELETE request at /user
app.delete('/user', function (req, res) {
  res.send('Got a DELETE request at /user');
})

app.all('/secret', function (req, res, next) {
  console.log('Accessing the secret section ... with method '+req.method)
  res.send('Got a '+req.method+' request at /secret');
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
