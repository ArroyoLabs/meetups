#!/bin/sh

# Install glide for Go dependency management
apt-get -y install python-software-properties software-properties-common
add-apt-repository -y ppa:masterminds/glide && apt-get update
apt-get -y install glide

echo "Glide installed"