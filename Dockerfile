FROM node:10-alpine

WORKDIR /usr/src/trapbot

COPY package*.json ./

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    && npm install --save-dev smee-client \
    && npm install --production \
    probot \
    && apk del .gyp

RUN npm install --production

COPY . .

CMD ["npm","run","start"]

EXPOSE 3000

