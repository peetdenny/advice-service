FROM node:4-onbuild
MAINTAINER Ewa Dadacz <ewa.dadacz@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential apt-transport-https ca-certificates libsystemd-journal0

# Create app directory
ENV INSTALL_PATH /usr/src/advice-service
ENV AMQP_URI amqp://test:test@192.168.200.10
RUN mkdir -p $INSTALL_PATH


# Install app dependencies
COPY package.json $INSTALL_PATH
RUN npm install -g nodemon
RUN npm install 


# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "$INSTALL_PATH/app.js", "$AMQP_URI"]

