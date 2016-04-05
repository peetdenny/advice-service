var logger = require('./logger')
var amqp = require('amqplib/callback_api');

module.exports = function(amqpUri) {

	logger.info("Using AMQP uri %s", amqpUri)

	var module = {}

	var answersMapping = {
		"How many hours have you been awake for so far?" : {
			"less than 18 hours" : 8,
			"18 - 24 hours" : 4,
			"24 - 48 hours" : 2,
			"more than 48 hours" : 1,
		},

		"How do you refer to your child?" : {
			"Little Miss Pookums McCutiepie" : 7,
			"My little cherub" : 5,
			"Dave" : 3,
			"That child" : 1,
			"The Spawn" : -5,
		},

		"How many children have you fired out of a cannon?" : {
			"0" : 10,
			"1" : 2,
			"A busload" : -10
		},
	}

	module.process = function(email, questions) {

		logger.debug("Calculating an advice for %s and %s", email, JSON.stringify(questions))

		var score = 0;
		questions.forEach ( function(item) {
			var thisAnswer = answersMapping[item.question];
			if(!thisAnswer){
				logger.error("Get match question %s with data", item.question)
				return;
			}

			var thisScore = thisAnswer[item.answer];
			if(!thisScore){
				logger.error("Get match answer %s with data %s", item.answer, thisAnswer)
				return;
			}

			score += thisScore;
		});

		var recommendation = "";
		if(score == 25){
			recommendation = "Wow, top marks. You are the most chilled-out parent in the world. You're like that old turtle dude out of Finding Nemo. Go on, be honest, you don't actually have kids yet, right?";
		} else if (score > 14) {
			recommendation = "Doing well message"
		} else if (score > 0) {
			recommendation = "Doing OK message"
		} else if (score > -14) {
			recommendation = "Doing badly message"
		} else {
			recommendation = "Everybody stand back! She's gonna blow! Seriously, you should put on your sou'wester, there's about to be a hurricaine.\nHere, here's two tickets to the spa. (One of them's not for your baby)"
		}

		var advice = {
			email : email,
			recommendation : {
				message: recommendation,
				score: score,
			},
			timestamp : new Date()
		}

		logger.info("Calculated an advice %s with score %d", advice, score)

		// send notification to document service
		amqp.connect(amqpUri, {}, function(err, conn) {
			if(err){
				logger.info(err)
				if(conn) conn.close();
				return;
			}

			conn.createChannel(function(err, ch) {
				var queueName = 'document-service';
				var message = JSON.stringify(advice)

			    ch.assertQueue(queueName, {durable: true});
			    ch.sendToQueue(queueName, new Buffer(message), {persistent: true});
				logger.debug("Sent advice %s to queue %s", message, queueName);
			});
		});
	}

	return module;
}
