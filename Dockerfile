FROM node:16

USER node
WORKDIR /home/node
RUN npm i -g npm
ADD package*.json ./
RUN NODE_ENV="" npm i --ignore-scripts
ADD . ./
EXPOSE 4000 9229
CMD ["npm", "run", "dev"]
