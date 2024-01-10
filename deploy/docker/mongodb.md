# Deploy MongoDB on Docker with Ubuntu

# Environment

- Ubuntu 22.04

# Install Docker and mongosh

- Download from the [Docker official website](https://www.docker.com/)
- Download from the [mongosh official website](https://www.mongodb.com/docs/mongodb-shell/install/)

# Pull Ubuntu 22.04 Docker Image

Pull the Ubuntu 22.04 image from Docker Hub

- `docker pull ubuntu:22.04`

# Create a Docker Container with Ubuntu 22.04

- `docker run -it --name <CONTAINER_NAME> ubuntu:22.04`

# Install MongoDB in the Container

(Install the community edition)

```jsx
apt-get update && \
      apt-get -y install sudo
```

- Import the public key used by the package management system
  - `sudo apt-get install gnupg curl`
- To import the MongoDB public GPG key from https://pgp.mongodb.com/server-7.0.asc

```jsx
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
```

- Create the /etc/apt/sources.list.d/mongodb-org-7.0.list file for Ubuntu 22.04 (Jammy):
  - `echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list`
- Reload local package database
  - `sudo apt-get update`
- Install the latest version of MongoDB packages
  - `sudo apt-get install -y mongodb-org`

# Start MongoDB directly

1. `mongod`

- Run it in the background instead (Optional)
  1. `mongod --fork --logpath /var/log/mongod.log`
- To ensure MongoDB is running in your Docker container, type the command in the terminal
    - `docker ps`
    
    ```jsx
    CONTAINER ID   IMAGE          COMMAND       CREATED          STATUS          PORTS     NAMES
    dd3af009a186   ubuntu:22.04   "/bin/bash"   16 minutes ago   Up 16 minutes             mongodb_container_1558
    ```
    
- Verify that MongoDB is running
  1. `mongosh`

# In mongosh CLI

Frequently used commands:

1. **`show dbs`**: Lists all the databases present in the MongoDB server.
2. **`use test_db`**: Switches the current working environment to the database named **`test_db`**.
3. **`db`**: Displays the name of the current database you are working with.
4. **`show collections`**: Lists all the collections (similar to tables in SQL) in the current database.
5. **`help`**: Provides an overview of common commands and their descriptions in the MongoDB shell.
6. **`db.hostInfo()`**: Returns information about the system hosting the MongoDB server instance.

   ```jsx
   test_db> db.hostInfo()
   {
     system: {
       currentTime: ISODate('2024-01-10T08:28:35.044Z'),
       hostname: 'dd3af009a186',
       cpuAddrSize: 64,
       memSizeMB: Long('3933'),
       memLimitMB: Long('3933'),
       numCores: 4,
       numPhysicalCores: 1,
       numCpuSockets: 1,
       cpuArch: 'aarch64',
       numaEnabled: false,
       numNumaNodes: 1
     },
     os: { type: 'Linux', name: 'Ubuntu', version: '22.04' },
     extra: {
       versionString: 'Linux version 5.15.49-linuxkit (root@buildkitsandbox) (gcc (Alpine 10.2.1_pre1) 10.2.1 20201203, GNU ld (GNU Binutils) 2.35.2) #1 SMP PREEMPT Tue Sep 13 07:51:32 UTC 2022',
       libcVersion: '2.35',
       kernelVersion: '5.15.49-linuxkit',
       cpuFrequencyMHz: '',
       cpuFeatures: '',
       pageSize: Long('4096'),
       numPages: 1006961,
       maxOpenFiles: 1024,
       mountInfo: [
         {
           mountId: 581,
           parentId: 460,
           major: 0,
           minor: 177,
           root: '/',
           mountPoint: '/',
           options: 'rw,relatime',
           fields: 'master:236',
           type: 'overlay',
           source: 'overlay',
           superOpt: 'rw,lowerdir=/var/lib/docker/overlay2/l/KAQGB4TTZ6QAZNT4PHT52W6ZDQ:/var/lib/docker/overlay2/l/F7JUNZKKUQF4Q3UB2WMEDUKGL2,upperdir=/var/lib/docker/overlay2/05fcc949ee5cbcfb08821ec5c5829f70d123059658eff4d8c69f5c58c3290773/diff,workdir=/var/lib/docker/overlay2/05fcc949ee5cbcfb08821ec5c5829f70d123059658eff4d8c69f5c58c3290773/work'
         }
       ]
     },
     ok: 1
   }
   ```

# Reference

- **[Install MongoDB Community Edition on Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)**
- https://github.com/microsoft/WSL/issues/1822
