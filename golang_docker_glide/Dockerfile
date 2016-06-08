FROM golang
 
# Some convenient tools
RUN apt-get update && apt-get -y install vim

# Go environment
ARG project_name
ADD ./src/$project_name /go/src/$project_name

# Install Glide
ADD ./docker/scripts /src
RUN cd /src && chmod 770 glide.sh && ./glide.sh

RUN go install $project_name
ENTRYPOINT /go/bin/project

EXPOSE 8888 
