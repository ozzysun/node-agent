FROM node:12.17-alpine3.10
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --only=production
COPY . /usr/src/app
EXPOSE 13579
CMD ["node", "src/index"]