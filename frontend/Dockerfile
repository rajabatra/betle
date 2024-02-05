FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:lts-alpine as deployment
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build

CMD ["node", "node_modules/.bin/serve", "-s", "build"]
