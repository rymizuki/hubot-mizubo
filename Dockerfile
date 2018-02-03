FROM node:9.4.0

LABEL maintainer "mizuki_r <ry.mizuki@gmail.com>"

# Setup yarn
RUN npm install -g yarn

# Setup app
RUN mkdir -p /app
WORKDIR /app

ADD ./package.json /app
ADD ./yarn.lock /app
RUN yarn install

COPY . /app/

CMD bin/hubot -a slack
