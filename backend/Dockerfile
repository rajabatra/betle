FROM node:lts-alpine as deployment
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

CMD ["node", "server"]
