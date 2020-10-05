FROM node:12

WORKDIR /home/dru/Desktop/code/Baby-Monitor

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000 8081

CMD ["node","index.js"]
