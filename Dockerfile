FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm run build

RUN rm -rf ./src

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
