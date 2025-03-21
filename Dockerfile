FROM node:22.13.1-alpine
COPY ./ /usr/app
WORKDIR /usr/app
RUN npm install
