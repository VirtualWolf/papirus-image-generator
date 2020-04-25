FROM node:12.16.2-alpine AS base

FROM base AS build
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
RUN mkdir -p /opt/build
WORKDIR /opt/build
COPY package*.json ./
RUN npm install
COPY app.js .

FROM base AS release
RUN apk add --no-cache \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    ttf-freefont
RUN mkdir -p /opt/service && chown -R node: /opt/service
USER node
WORKDIR /opt/service
COPY --chown=node:node --from=build /opt/build /opt/service

EXPOSE 3000

CMD ["node", "/opt/service/app.js"]
