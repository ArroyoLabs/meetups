#!/bin/sh

# Install Go
# Borrowed from https://www.digitalocean.com/community/tutorials/how-to-install-go-1-6-on-ubuntu-14-04
curl -O https://storage.googleapis.com/golang/go1.6.linux-amd64.tar.gz
tar -xvf go1.6.linux-amd64.tar.gz
mv go /usr/local

# Export path & add to profile so it gets set automatically
export PATH=$PATH:/usr/local/go/bin
export GOPATH=/go
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
echo 'export GOPATH=/go' >> ~/.profile
source ~/.profile

echo "Golang installed"
echo $GOPATH