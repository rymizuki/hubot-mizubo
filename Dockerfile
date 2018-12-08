FROM node:10.14.1-alpine
RUN apk update \
 && apk --no-cache add yarn \
 && apk --no-cache add git \
 && apk --no-cache --update add tzdata \
 && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
 && apk del tzdata \
 && rm -fr /var/cache/apk/*

WORKDIR /usr/local/docker/app

COPY ./package.json /usr/local/docker/app/package.json
COPY ./package-lock.json /usr/local/docker/app/package-lock.json

RUN npm install

COPY ./lerna.json /usr/local/docker/app/lerna.json
COPY ./packages /usr/local/docker/app/packages

RUN npx lerna bootstrap

CMD ["npm", "start"]
