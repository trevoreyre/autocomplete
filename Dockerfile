FROM trevoreyre/node
ENV HOST 0.0.0.0
USER node

RUN mkdir /home/node/app
RUN mkdir /home/node/app/node_modules

WORKDIR /home/node/app
