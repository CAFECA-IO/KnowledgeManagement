# Create sudoer user in Ubuntu
1. Create the Group
2. Add Users to the Group
3. Check Group Membership

## Create the Group
Use the groupadd command to create a new group.
```shell
sudo groupadd developer
```

## Add Users to the Group
Use the usermod -a -G command to add each user to the "developer" group.  
The -a option stands for append, meaning it adds the user to this group without removing them from other groups they are currently in.  
The -G option specifies the group name.
```shell
sudo usermod -a -G developer user1
sudo usermod -a -G developer user2
sudo usermod -a -G developer user3
```

## Check Group Membership
Use the getent group developer command to verify that the "developer" group includes these three accounts.
```shell
getent group developer
```
```
developer:x:1004:user1,user2,user3
```

# Note
These commands need to be executed with administrative privileges, usually acquired by using sudo to gain the necessary permissions. Make sure you have the proper rights before running these commands and that the user accounts already exist in the system.
