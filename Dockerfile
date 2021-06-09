FROM node:12

WORKDIR /usr/src/Pixel-Shelf

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y sqlite3

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN cd models
RUN mkdir db
RUN cd db
RUN cat ../initdb.sql | sqlite3 pixelshelf.db
RUN cd ../..

ENV PORT=3000
EXPOSE 3000

CMD [ "npm", "start" ]