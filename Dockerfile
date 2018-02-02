FROM ubuntu:16.04

LABEL maintainer "mizuki_r <ry.mizuki@gmail.com>"

# Install packages
RUN apt-get update
RUN apt-get install -y git curl redis-server
RUN apt-get clean

# Install ndenv
RUN git clone https://github.com/riywo/ndenv /usr/local/ndenv

# Set ndenv's path
RUN echo '# ndenv' > /etc/profile.d/ndenv.sh
RUN echo 'export NDENV_ROOT=/usr/local/ndenv' >> /etc/profile.d/ndenv.sh
RUN echo 'export PATH="$NDENV_ROOT/bin:$PATH"' >> /etc/profile.d/ndenv.sh
ENV PATH /usr/local/ndenv/bin:$PATH
RUN echo 'eval "$(ndenv init -)"' >> /etc/profile.d/ndenv.sh
RUN chmod +x /etc/profile.d/ndenv.sh

## Install node-build
RUN mkdir -p /usr/local/ndenv/plugins
RUN git clone https://github.com/riywo/node-build.git /usr/local/ndenv/plugins/npde-build

# Install ndenv-install-yarn
RUN git clone https://github.com/pine/ndenv-yarn-install.git /usr/local/ndenv/plugins/ndenv-yarn-install

# Set shims's path for ndenv
ENV NDENV_ROOT /usr/local/ndenv
ENV PATH $NDENV_ROOT/shims:$NDENV_ROOT/bin:$PATH

# Setup app
RUN mkdir -p /app
COPY . /app/

WORKDIR /app
RUN ndenv install `cat .node-version`

RUN yarn install
CMD bin/hubot -a slack
