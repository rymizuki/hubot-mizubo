# hubot-numabo

## Setup

### Create env

```
$ echo '
# for slack
HUBOT_SLACK_TOKEN=

# for weatcher
HUBOT_WEATHER_KEY=

# for apac
HUBOT_APAC_ACCESS_KEY=
HUBOT_APAC_ACCESS_SECRET_KEY=
HUBOT_APAC_ASSOCIATE_TAG=
' > .env
```

### Execute hubot

```
$ ./bin/build
$ ./bin/start
```

# Commands

## build

build docker image

```
$ ./bin/build
```

## start

start docker container for prodcution.
use hubot's adapter slack.

```
$ ./bin/start
```

## stop

stop docker container.

```
$ ./bin/stop
```

## dev

start docker container for development.
use hubot's adapter shell.

```
$ ./bin/dev
```

## exec

execute this docker container process.

```
$ ./bin/exec sh
```%
