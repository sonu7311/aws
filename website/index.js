#!/usr/bin/nodejs

// -------------- load packages -------------- //
var express = require('express');
var app = express();
var path = require('path');
var hbs = require( 'express-handlebars' )//require('hbs');
var cookieSession = require('cookie-session')
var fs = require("fs");
var creds = JSON.parse(fs.readFileSync("creds.json"))
var mysql = require('mysql');
// -------------- express initialization -------------- //

app.set('port', process.env.PORT || 8080 );
app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  partialsDir: path.join(__dirname, 'static', 'views', 'partials'),
} ) );
app.set('view engine', 'hbs');

//cookies//
app.set('trust proxy', 1) // trust first proxy 

app.use(cookieSession({
  name: 'cookieSession',
  keys: ['TheseWillBe123', 'Replaced456']
}))


// -------------- serve static folders -------------- //
app.use('/home/js', 	express.static(path.join(__dirname,'static', 'Home', 'js')))
app.use('/home/css',	express.static(path.join(__dirname,'static', 'Home', 'css')))
app.use('/documents', 	express.static(path.join(__dirname,'static', 'Documents')))
app.use('/landing/css', express.static(path.join(__dirname,'static', 'Landing','css')))
app.use('/landing/js', 	express.static(path.join(__dirname,'static', 'Landing','js')))
app.use('/covid/css', 	express.static(path.join(__dirname,'static', 'HooHacks20','Website','css')))
app.use('/covid/js', 	express.static(path.join(__dirname,'static', 'HooHacks20','Website','js')))
app.use('/secure/css', express.static(path.join(__dirname,'static', 'Secure','css')))
app.use('/secure/js', 	express.static(path.join(__dirname,'static', 'Secure','js')))

// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    res.redirect('/landing')//.render(path.join(__dirname,'index.hbs'),{'profile':req.session.profile});
});
app.get('/home', function(req, res){
	console.log("Going To Home Page");
    res.render(path.join(__dirname,'static','Home','index.hbs'),{layout: false});
});

// -------------- Landing Page -------------- //
app.get('/landing', function(req,res){
	console.log("Going To Landing Page");
    res.render(path.join(__dirname,'static','Landing','index.hbs'), {'jump':req.query.jump}); 
});

app.get('/attendance', function(req,res){
	console.log("Jumping To Attendance Card");
    res.redirect('/landing?jump=csl_card')
});

app.get('/gan', function(req,res){
	console.log("Jumping To GAN Card");
    res.redirect('/landing?jump=gan_card')
});

app.get('/anant', function(req,res){
	console.log("Jumping To Anant Card");
    res.redirect('/landing?jump=anant_card')
});

app.get('/bigparser', function(req,res){
	console.log("Jumping To Big Parser Card");
    res.redirect('/landing?jump=bp_card')
});

app.get('/resume', function(req, res){
	res.redirect('/documents/Sagar_Saxena_Resume_Hidden.pdf');
});
// ------------- HooHacks20 ------------- //
const sgMail = require('@sendgrid/mail');
const { MongoClient } = require('mongodb');

sgMail.setApiKey(creds.twillio);
const uri = "mongodb+srv://" + creds.mongo + "@hoohacks2020-czgp0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect();

// distinct past dates
async function past(client){
    var pastDates = await client.db("covid").collection("locations").distinct("Date");
	console.log(pastDates)
    return pastDates;
}

// distinct future dates
async function future(client){
    var futureDates = await client.db("covid").collection("predictions").distinct("Date");
    return futureDates;
}

// data given a day that has passed
async function dataOfPast(client, day){
    var dataPast = await client.db("covid").collection("locations").find({Date: day}).toArray();
    return dataPast;
}

// data given a day that has passed
async function dataOfFuture(client, day){
    var dataFuture = await client.db("covid").collection("predictions").find({Date: day}).toArray();
    return dataFuture;
}


app.get('/covid', function(req,res){
    res.render(path.join(__dirname,'static','HooHacks20','Website','index.hbs')); 
});

app.get('/covid_dates', function(req, res) {
	past(client).then(pst => {
		future(client).then(fut => {
		
			var response = {
				response: 200,
				past: pst,
				pred: fut
			}

			res.send(response)
		});
	});
});

app.get('/covid_data', function(req,res){
	var date = req.query.date;
	
	dataOfPast(client, date).then(pst => {
		dataOfFuture(client,date).then(fut => {
			var response = {
				response: 200,
				past: pst,
				pred: fut
			}

			res.send(response)

		});
	});
});

app.get('/covid_email', function(req,res){
    var name = req.query.name;
	var cases = req.query.cases;
	var date = req.query.date;
	var beds = req.query.beds;
	var vents = req.query.vents;
	var email = req.query.email;

	var emSubject, emText;
	emSubject = 'COVID-19 Report for location: '+ name;
	emText = 'This is an update on COVID-19 at '+ name +
		     '\n On Date' + date +
         '\n'+'The number of Cases Reported are: ' + cases +
         '\n'+'The Number of Ventilators needed are: '+ vents + 
         '\n'+'The Number of Beds needed are: '+ beds; 
	
	console.log(emText)
	console.log(req.query)

	const msg = {
  		to: email,
 		from: 'hitnuke@gmail.com',
  		subject: emSubject,
  		text: emText,
  		html: emText,
	};
	sgMail.send(msg);

    var response = {
        response: 200,
		data: req.query
    }
    res.send(response)
});
// ----------- Secure Login ------------- //
app.get('/login', function(req, res){
    res.render(path.join(__dirname,'static','Secure','login.hbs')); 
});	
// -------- Spotify To Youtube ---------- //
//app.get(
// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 
app.get('/:page',function(req,res){
	console.log("Error Page Not Found");
	res.send({"Message": "Error Page Not Found", "Code": "404"});
});

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});
