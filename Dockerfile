FROM node:argon
MAINTAINER Soichiro Shishido
RUN npm install -g gulp mocha istanbul coveralls
CMD ["/bin/bash"]
