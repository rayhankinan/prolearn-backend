FROM node:18

WORKDIR /app

RUN apt-get update

# Install SSH Password Authentication
RUN apt-get install sshpass

COPY package*.json ./

RUN yarn

COPY . .

CMD ["yarn", "start"]

EXPOSE 8080