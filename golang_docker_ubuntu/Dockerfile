FROM ubuntu:trusty

# File Author / Maintainer
MAINTAINER John Arroyo, john@arroyolabs.com

ENV DEBIAN_FRONTEND noninteractive

################## BEGIN INSTALLATION ######################
RUN apt-get update && apt-get -y upgrade

RUN apt-get install -y \
    git \
    git-core \
    curl \
    python-software-properties \
    software-properties-common \
&& apt-get clean

# Bundle scripts in this folder on your instance
COPY ./scripts /src
COPY ./src /go/src
COPY ./bin /go/bin

# Install golang and glide
RUN cd /src && chmod 770 *.sh && ./setup.sh

# Compile your go app
ARG project_name
# ADD ./src/$project_name /go/src/$project_name
# RUN /usr/local/go/bin/go install $project_name

##################### INSTALLATION END #####################

# Expose the default port(s)
EXPOSE 8888

ENTRYPOINT /go/bin/project