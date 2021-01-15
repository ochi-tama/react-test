ARG VARIANT="node-alpine"
# FROM buildpack-deps:${VARIANT}-curl
FROM node:14.15.4-alpine3.12

RUN apk update && apk upgrade && apk add \
    git
RUN yarn global add firebase-tools