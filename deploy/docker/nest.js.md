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
COPY .env .env.development ./

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

![Screenshot 2024-01-26 at 17 36 30](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/8990a246-547a-4001-a255-703d74ed6b84)


### **Run the Docker**

- `docker run --rm -p 3001:3001 --name <container-name> <image-name>`
![Screenshot 2024-01-26 at 17 38 13](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/64d34681-6ead-4a47-af9a-ea9438b252ee)

- connect with mongodb running on docker
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

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/20677913/0064ed6b-6f22-41e4-b0a0-f68164c2ca6c)


# Reference

- [Containerizing Next.js App with Docker: Quick Guide](https://dev.to/pulkit30/containerizing-nextjs-app-with-docker-quick-guide-51ml)
- [next.js with docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
