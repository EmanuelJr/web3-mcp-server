FROM node:22.12-alpine

COPY src /app/src
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "start"]
