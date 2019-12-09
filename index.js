// // server.js
// // load the things we need
// var express = require('express');
// var app = express();

// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // use res.render to load up an ejs view file

// // index page 
// app.get('/', function(req, res) {
//     res.render('pages/index');
// });

// // about page 
// app.get('/about', function(req, res) {
//     res.render('pages/about');
// });

// app.listen(8080);
// console.log('8080 is the magic port');






var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// app.get('/', function(req, res) {
//     // response.sendFile(path.join(__dirname + '/login.html'));
//     res.render('pages/index');
// });

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// index page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// login page 
app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// admin page 
// app.get('/admin', function(req, res) {
//     res.render('pages/admin');
// });

app.get('/home', function(request, response) {

	if (request.session.loggedin) {
		// response.send('Welcome back, ' + request.session.username + '!');
		var userName = request.session.username;
		response.render('pages/admin', {
			userName: userName
		});

	} else {
		response.render('pages/login');
		// response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

app.listen(3000);

// Tutorials: https://codeforgeek.com/manage-session-using-node-js-express-4/
// https://codeshack.io/basic-login-system-nodejs-express-mysql/