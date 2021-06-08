FROM node:12

WORKDIR /usr/src/Pixel-Shelf

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "start" ]