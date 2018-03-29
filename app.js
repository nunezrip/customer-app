var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*var logger = function(req, res, next) {
	console.log('Logging...');
	next();
};

app.use(logger);
*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body pareser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Stattic Path
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
}); 

// Express Validator Middleware (Set Form Input Validator)
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
	var namespace = param.split('.')
	, root = namespace.shift()
	, formParam = root;

	while(namespace.length){
		formParam += '[' + namespace.shift() + ']';
	}
	return {
		param : formParam,
		msg   : msg,
		value : value
	};
}
}));

app.get('/', function(req, res) {
	// find everything
db.users.find(function (err, docs) {
	// docs is an array of all the documents in mycollection
	console.log(docs);
	res.render('index', {
		title: 'Customers',
		users: docs,
	});
})

});

app.post('/users/add', function(req, res){
	console.log('FORM SUBMITTED!');
	// console.log(req.body.first_name);
	// console.log(req.body.last_name);
	// console.log(req.body.email);

	req.checkBody('first_name', 'WARNING: Fisrt Name is Required').notEmpty();
	req.checkBody('last_name', 'WARNING: Last Name is Required').notEmpty();
	req.checkBody('email', 'WARNING: Your E-mail is Required').notEmpty();

	var errors = req.validationErrors();

	if(errors ) {
		console.log('ERRORS');
		res.render('index', {
			title: 'Customers',
			users: users,
			errors: errors
		});
	} else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}

		db.users.insert(newUser, function(err, result){
if(err){
console.log(err);
};
res.redirect('/');
		});

		console.log('SUCCESS');
		console.log(newUser);
	}

});

app.delete('/users/delete/:id', function(req, res){
	// console.log(req.params.id);
	db.users.remove({_id:ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		};
		res.redirect('/');
	})
})

app.listen(3000, function() {
	console.log('Server Started on Port 3000...');
});
