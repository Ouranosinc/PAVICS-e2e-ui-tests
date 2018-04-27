FROM cypress/base
MAINTAINER Renaud Hébert-Legault <renaud.hebert-legault@crim.ca>
LABEL Description="PAVICS Platform - Based on Node.js, React, Redux, Webpack, OpenLayers, Koa and MaterialUI" Vendor="CRIM" Version="1.0.0"
WORKDIR /frontend

ENV npm_config_loglevel=warn

ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm install
ADD . .

CMD ["npm", "test"]