#!/bin/sh

# Install glide for Go dependency management
# https://github.com/Masterminds/glide/releases/latest
cd /src
curl -L -O https://github.com/Masterminds/glide/releases/download/0.10.2/glide-0.10.2-linux-amd64.tar.gz

tar -xvf glide-0.10.2-linux-amd64.tar.gz
mv linux-amd64/glide /usr/local/bin

rm -r linux-amd64
rm glide-0.10.2-linux-amd64.tar.gz

echo "Glide installed at /usr/bin/glide"