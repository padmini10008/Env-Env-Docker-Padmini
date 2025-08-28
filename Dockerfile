FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache gnupg

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "secrets-loader.js"]
