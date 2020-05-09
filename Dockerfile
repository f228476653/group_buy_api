FROM node:13.6.0-buster
WORKDIR user/src/group-buy-api
COPY ./ ./
RUN npm install