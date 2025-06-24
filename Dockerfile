FROM node:22-alpine AS build

RUN apk update && apk upgrade
WORKDIR /app

COPY . .

RUN yarn install

RUN  yarn build

FROM node:22-alpine AS run

RUN apk update && apk upgrade
WORKDIR /app

COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/node_modules ./node_modules

EXPOSE 8080
CMD ["node", "dist/app.js"]