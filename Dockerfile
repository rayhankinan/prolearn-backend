FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install build-essential

COPY . .

CMD ["yarn", "start"]

EXPOSE 8080