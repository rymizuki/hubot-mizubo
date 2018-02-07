FROM alpine:3.7
RUN apk update \
 && apk --no-cache add yarn \
 && apk --no-cache add git \
 && apk --no-cache --update add tzdata \
 && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
 && apk del tzdata \
 && rm -fr /var/cache/apk/*

RUN mkdir /hubot
WORKDIR /hubot

CMD ["./bin/hubot"]
