# advice-service
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

# Running docker container
There are 2 advice-services running in separate containerisand behind load balancer. <br />
To set up this properly, advice-service containers need to be run first:
- cd ../advice-service
- docker build -t advice-service . (build docker image first)
- docker run -ti -d -p 3000 -e AMQP_URI='amqp://guest:guest@192.168.200.10' --name advice-service1  advice-service <br />
(run first container with the name advice-service1; pass AMQP_URI environment variable and open port 3000)
- docker run -ti -d -p 3000 -e AMQP_URI='amqp://guest:guest@192.168.200.10' --name advice-service2  advice-service <br />
(do the same for container advice-service2)
- now go and run advice-ui container
