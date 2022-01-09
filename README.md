# demo chat app

## Project setup for dev environment

### Install dependencies
```
cd frontend
npm install

cd server
npm install
```

### Start redis (should be installed prior, should run on port 6379)
#### mac
```
brew services start redis
```
#### ubuntu
```
sudo systemctl start redis
```

### Start backend
```
cd server && nodemon app.js
```
or (no hot reload)
```
cd server && npm run start
```
### Start frontend
```
cd frontend && npm run serve
```

### Use the app
Web:
navigate to [http://localhost:8080](http://localhost:8080)

Command-line:
connect with netcat:
```
nc localhost 3001
```
Test the app functionality by logging via both web and command line and sending messages.
You should see new messages by both users appear in each interface.