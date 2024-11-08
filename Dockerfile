FROM node:23-alpine3.19

WORKDIR /app

COPY app/package.json .

RUN npm install

COPY app/ .

CMD ["node","index.js"]


