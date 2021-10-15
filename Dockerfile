FROM node:14

EXPOSE 3000

RUN mkdir /app

WORKDIR /app

COPY package.json ./app

RUN npm install

COPY . /app

CMD ["npm", "start"]
