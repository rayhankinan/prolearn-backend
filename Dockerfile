FROM node:latest
WORKDIR /app

COPY . .
RUN yarn

RUN ["yarn", "build"]
CMD ["node", "dist/main.js"]