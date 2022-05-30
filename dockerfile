FROM node:16.15.0-slim
EXPOSE 3000

# install open ssl
RUN apt-get update
RUN apt-get install -y openssl

# Set working directory
WORKDIR /app

COPY package.json yarn.lock /app/

# Install the dependencies
RUN yarn install
COPY . .

# start the dev servers
CMD yarn prisma generate && yarn dev