FROM node:lts
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

CMD ["node", "server"]
