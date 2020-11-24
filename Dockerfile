FROM node:15

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

CMD [ "npm", "run", "startd" ]