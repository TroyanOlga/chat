# demo chat app

## Project setup for dev environment

1. ### Install dependencies
```
cd frontend
npm install

cd server
npm install
```

2. ### Add .env files to both server and frontend folders
Use .env.example as reference

3. ### Start redis (should be installed prior)
#### mac
```
brew services start redis
```
#### ubuntu
```
sudo systemctl start redis
```

4. ### Start backend
```
cd server && nodemon app.js
```
or (no hot reload)
```
cd server && npm run start
```
5. ### Start frontend
```
cd frontend && npm run serve
```

6. ### Use the app
Web:
navigate to [http://localhost:8080](http://localhost:8080)

Command-line:
connect with netcat:
```
nc localhost 3001
```
7. Test the app functionality by logging via both web and command line and sending messages.
You should see new messages by both users appear in each interface.