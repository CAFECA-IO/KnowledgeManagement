# **Deploy MongoDB on Docker**

## **Environment**

- Any system with Docker installed

## **Install Docker**

- Download Docker from the [official website](https://www.docker.com/).

## **Pull MongoDB Docker Image**

- Execute **`docker pull mongo`** to pull the latest MongoDB image.

## **Create a New MongoDB Container**

- Run **`docker run --name mongodb_for_test_0129 -d -p 27017:27017 mongo`**.
    - Replace **`mongodb_for_test_0129`** with your desired container name.

## **Manage the Container**

- List active containers: **`docker ps`**
- Access the container's bash: **`docker exec -it mongodb_for_test_0129 bash`**
    - Ensure the container is running before attempting to access bash.

## **Use MongoDB Shell**

- Enter MongoDB shell: **`mongosh`**
- Create or switch to a database: **`use test_0129`**
- Insert data into a collection: **`db.test_0129_collection.insertOne({ "name": "Anna", "age": 15 })`**
- Display all databases: **`show dbs`**
- Show host information: **`db.hostInfo()`**
- List collections in the current database: **`show collections`**

## **Exit MongoDB and Container Bash**

- Exit the MongoDB shell by typing **`exit`**
- Exit the container's bash with another **`exit`**

## **Stop the Container**

- Stop the running container: **`docker stop mongodb_for_test_0129`**

