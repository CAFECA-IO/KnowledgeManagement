### In the existing projects

- At the root of the project: create `Dockerfile`
    
```jsx
# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY development.env ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3001

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
```
    

    


### **Build the Docker Image**

- Install Docker on your machine ([official](https://docs.docker.com/get-docker/))
- At the root of the project:
    - `docker build -t <your-image-name> .`



### **Run the Docker**

- `docker run --rm -p 3001:3001 --name <container-name> <image-name>`

- connect with mongodb running on docker
  - modify the way to get mongodb URL
```tsx
// in `src/common/common/common.module.ts`
uri: config.get<string>('MONGO_URI'),
// uri: config.get<string>('mongo.uri'),
```

  - change the `.env` or `development.env` or `production.end` in the case, we don't have authentication by default

```jsx
MONGO_PROTOCOL=mongodb
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_RESOURCE=<YOUR_IP_ADDRESS>
MONGO_DATABASE=<DATABASE_FOR_TEST>
MONGO_PORT=27017

MONGO_URI=mongodb://<YOUR_IP_ADDRESS>:27017/<DATABASE_FOR_TEST>
```



# Reference

- [Dockerizing NestJS Application](https://medium.com/@sujan.dumaru.official/dockerizing-nestjs-application-c4b25139fe4c)
- [screenshot of process](https://github.com/CAFECA-IO/KnowledgeManagement/issues/94#issuecomment-1911759715)
