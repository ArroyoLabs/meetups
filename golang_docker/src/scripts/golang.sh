#!/bin/sh

# Install Go
# Borrowed from https://www.digitalocean.com/community/tutorials/how-to-install-go-1-6-on-ubuntu-14-04
curl -O https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
tar -xvf go1.6.linux-amd64.tar.gz
mv go /usr/local

# Copy example compiled Go app
mkdir -p /var/www/code
cp -R /src/code/bin /var/www/code/

# Export path & add to profile so it gets set automatically
export PATH=$PATH:/usr/local/go/bin
export GOROOT=/usr/local/go
export GOPATH=/var/www/code

echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
echo 'export GOROOT=/usr/local/go' >> ~/.profile
echo 'export GOPATH=/var/www/code' >> ~/.profile
source ~/.profile

echo "Golang installed"