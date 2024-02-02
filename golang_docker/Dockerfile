FROM golang:1.22rc2-bookworm
 
# Some convenient updates and tools
RUN apt-get update && apt-get -y install vim

# Go environment
ADD ./src/project /go/src/project
RUN go install project
ENTRYPOINT /go/bin/project
 
EXPOSE 8888 
