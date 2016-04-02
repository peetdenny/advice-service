var logger = require('./logger')
var amqp = require('amqplib/callback_api');

module.exports = function(amqpUri) {

	logger.info("Using AMQP uri %s", amqpUri)

	var module = {}

	module.process = function(email, questions) {

		// TODO do the calc
		logger.debug("Generating an advice for %s", email)
		var advice = {
			email : email,
			recommendation : "Go to sleep",
			timestamp : new Date()
		}

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
