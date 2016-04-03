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

var args = process.argv.slice(2);

if(!args || args.length != 1){
	console.log("Please provide amqp uri in form amqp://user:password@host:port as input argument")
	process.exit(-1)
}

var advice = require('./advice')(args[0])

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

app.listen(3000, function () {
	logger.info('Advice service is up and running');
});
