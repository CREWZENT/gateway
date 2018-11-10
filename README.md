# Transfer Gateway

![Cover Image](http://gateway.teneocto.io/static/img/cover.png)

> Connecting Ethereum to a Token Ecosystem is available quickly, securely, and safely

## 1 Required
Plarform: Linux, Mac OS

Prepare first time:
```
$ cd src/dappchain
$ sh .install
$ npm i
$ cd ../../
$ npm i
```

## 2. Development

### 2.1 Run sidechain
Run:
```
$ cd src/dappchain
$ sh .reset (first time or delete old data)
$ sh .start
```

### 2.2 Deploy smart contract (Open new terminal)
Deploy:
```
$ cd src/dappchain
$ npm run deploy
$ npm run deploy:reset (delete old data)
```

### 2.3 Transfer gateway (Open new terminal)
Run:
```
$ cd src/dappchain
$ npm run gateway
```

### 2.4 Run webclient (Open new terminal)
Run:
```
$ npm start
```

---
## 3. Security for user info in server side

```fs
service cloud.firestore {
  match /databases/{database}/documents {
  	// Match any document in the 'users' collection
    match /users/{userId} {
      allow read: if request.auth.uid != null;
      allow create, update, delete: if request.auth.uid == userId;
    }
    
    // Match any document in the 'usersPrivateKey' collection
    match /usersPrivate/{userId} {
      allow read, create, update, delete: if request.auth.uid == userId;
    }
  }
}
```

## 4. Production
Required:
- Create VM instances at: `https://console.cloud.google.com/compute/instances`
- Open 2 port: `tcp:9999` and `tcp:46657` at `https://console.cloud.google.com/networking/firewalls/list`


### 4.1 SSH
#### 4.1.1 Localhost machine:
```
cd .ssh
rm -rf known_hosts
cat authorized_keys
```

#### 4.1.2 Remote machine:
```
chmod 700 .ssh
chmod 600 .ssh/authorized_keys
cd .ssh
vim authorized_keys
```
type I to Insert
Type Esc to done
Type :x to save and quit

### 4.2 Install the first time
```
$ sudo npm install pm2 -g
```

### 4.3 Serve webservice
```
$ cd src/dappchain
$ sh .pm2
$ cd ../../ && npm run build
```

Created by Brian Dhang. Powered by coffee, anime, LoomSDK and love.

© 2018 Teneocto Inc. All rights reserved.
