ARG VARIANT="node-alpine"
# FROM buildpack-deps:${VARIANT}-curl
FROM node:14.15.4-alpine3.12

RUN apk update && apk upgrade && apk add \
    git openjdk11-jre-headless bash
RUN yarn global add firebase-tools

ENV FIRESTORE_EMULATOR_HOST="localhost:8080" FIREBASE_AUTH_EMULATOR_HOST='localhost:9099' \
    GOOGLE_APPLICATION_CREDENTIALS='/workspace/server/secrets.json'