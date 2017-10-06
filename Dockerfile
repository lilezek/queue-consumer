# specify the node base image with your desired version node:<version>
FROM node:8

WORKDIR /usr/src/app

# Install app dependencies
COPY tsconfig.json package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

# Compile TypeScript
RUN npm run build

# replace this with your application's default port
EXPOSE 80

CMD ["npm", "start"]
