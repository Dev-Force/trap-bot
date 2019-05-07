FROM node:10-alpine

# A bunch of `LABEL` fields for GitHub to index
LABEL "com.github.actions.name"="Jira issues "
LABEL "com.github.actions.description"="Force valid Jira issues in PR titles"
LABEL "com.github.actions.icon"="gear"
LABEL "com.github.actions.color"="red"
LABEL "repository"="http://github.com/taxibeat/trap-bot"
LABEL "homepage"="http://github.com/taxibeat/trap-bot"
LABEL "maintainer"="Christos Petropulos <chrispetropoulos91@gmail.com>"

ENV PATH=$PATH:/usr/src/trapbot/node_modules/.bin

WORKDIR /usr/src/trapbot

RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++ \
    # && npm install --save-dev smee-client \
    && npm install --production \
    probot \
    && apk del .gyp

COPY . .

RUN npm install --production

ENTRYPOINT ["probot","receive", "-p", "/github/workflow/event.json", "-e", "pull_request" ]
CMD ["/usr/src/trapbot/src/index.js"]
#EXPOSE 3000

