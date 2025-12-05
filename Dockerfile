FROM node:22-alpine

ENV NODE_ENV=development
ENV PORT=4000

WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .

USER node

EXPOSE 4000 9229
CMD ["npm", "run", "dev"]
