#!/bin/sh

# Install glide for Go dependency management
add-apt-repository -y ppa:masterminds/glide && apt-get update
apt-get -y install glide

echo "Glide added"