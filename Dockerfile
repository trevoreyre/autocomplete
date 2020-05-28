FROM trevoreyre/node
ENV HOST 0.0.0.0
USER node

RUN mkdir /home/node/autocomplete
RUN mkdir /home/node/autocomplete/node_modules

WORKDIR /home/node/autocomplete
