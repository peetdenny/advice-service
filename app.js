var express = require('express');
var bodyParser = require('body-parser')
var logger = require('./logger')
var app = express();

app.use( bodyParser.json() ); 

const PORT = 3000;

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
  
	// TODO do the calc
	logger.debug("Generating an advice for %s", email)

  	res.send({"status" : "OK"})
});

app.listen(PORT, function () {
	logger.info('Advice service is up and running');
});
