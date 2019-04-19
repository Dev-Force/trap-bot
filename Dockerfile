FROM node:10-alpine

WORKDIR /usr/src/trapbot

COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["npm","run","start"]

expose 3000

