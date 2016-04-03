#!/bin/bash
sudo apt-get update
apt-get install -qq -y apt-transport-https ca-certificates libsystemd-journal0
apt-get install -qq -y build-essential sysv-rc-conf wget software-properties-common
wget -O docker.deb http://apt.dockerproject.org/repo/pool/main/d/docker-engine/docker-engine_1.10.0-0~trusty_amd64.deb
dpkg -i docker.deb
usermod -aG docker ubuntu
sysv-rc-conf docker on
curl -L https://github.com/docker/compose/releases/download/1.7.0-rc1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

