FROM node:14

WORKDIR /src

RUN npm install i npm@latest -g

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
