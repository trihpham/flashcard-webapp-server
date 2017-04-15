This is the server for my other repository "flashcard-webapp".


### Getting Started ###

Checkout this repo, install dependencies, then start the gulp process with the following:

```
	> git clone https://github.com/trihpham/flashcard-webapp-server.git
	> cd flashcard-webapp-server
	> npm install
  	> npm reset-db
	> npm dev
```
Note: You MUST put a config secret string in the config.js file exactly where null is. You also need MongoDb installed and running to be running to use this.