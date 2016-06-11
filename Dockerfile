FROM node:argon
MAINTAINER Soichiro Shishido
RUN npm install -g gulp mocha
CMD ["/bin/bash"]
