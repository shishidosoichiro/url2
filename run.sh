#!/bin/sh
docker run --rm -it -v `pwd`:/src --name node node:dev $@
