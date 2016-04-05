# document-service
Demo of a Node microservice with REST API

# Installation
1. Setup node environment (install npm)
2. Run "npm install"

# Running
Service requires an access rabbitmq to send notifications. Configuration to these service is passed via environment variable:
- AMQP_URI - uri to amqp in form: amqp://user:password@host:port


These env variables can be passed when running a node app. For instance:
<pre>AMQP_URI=amqp://test:test@192.168.200.10 node app.js</pre>

# REST API
Service exposes two methods:

GET /api/healthcheck
It shall return {"status":"Alive"} when service is up and running

POST /api/advice
Calculates an advice based on user-supplied questions. Please refer to app.js for details.
