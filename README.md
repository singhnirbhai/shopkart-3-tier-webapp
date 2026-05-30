# Create a docker file for Frontend
```bash
vi Dockerfile
```
```
FROM node:22-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```
# Create a docker file for Backend 
```bash
vi Dockerfile
```
```
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000


CMD ["node", "server.js"]
```
# Create docker image form the docker file  

# Important note first of create a database for backend containers  

# Create a new conection for frontend backend and database and use monogodb iamge for database 
```bash
docker network create ecommerce-net
```
# Create contaienr for mongodb
```bash
docker run -d --name mongodb --network ecommerce-net mongo:8
```

# Create backend container 
```bash
docker run -d --name backend --network ecommerce-net \
-e MONGO_URI=mongodb://mongodb:27017/shopkart -p 5000:5000 <container name>
```
# Create frontend container
```bash
docker run -d --name frontend --network ecommerce-net \
-p 3000:3000 <container name>
```
