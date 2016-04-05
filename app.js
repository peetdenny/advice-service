var express = require('express');
var bodyParser = require('body-parser')
var logger = require('./logger')
var app = express();

app.use( bodyParser.json() ); 

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var amqpUri = process.env.AMQP_URI

if(!amqpUri){
	console.log("Please set AMQP_URI environment variable. It has to be in form amqp://user:password@host:port")
	process.exit(-1)
}

var advice = require('./advice')(amqpUri)

/**
 * POST request for an advice.
 *
 * Accepted JSON format is as follows:
 {
	"questions" : [
		{
			"question": "What's you name?",
			"answer": "Boguslaw"
		},
		{
			"question": "How old are you?",
			"answer": "50"
		},
		{
			"question": "What is you favourite colour?",
			"answer": "Blue"
		}
	],

	"email": "mail@host.com"
}
*/
app.post('/api/advice', function (req, res) {
	var questions = req.body.questions
	var email = req.body.email
  
	advice.process(email, questions)

  	res.send({"status" : "OK"})
});

app.get('/api/healthcheck', function (req, res) {
  	res.send({"status" : "Alive"})
});

app.listen(3000, function () {
	logger.info('Advice service is up and running');
});
