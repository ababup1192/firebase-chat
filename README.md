# Firebase Chat

[![CircleCI](https://circleci.com/gh/ababup1192/firebase-chat.svg?style=svg)](https://circleci.com/gh/ababup1192/firebase-chat)

# Preparation

```
// Install tools
$ npm i -g typescript
$ npm i -g webpack
$ npm i -g webpack-dev-server
$ npm i -g karma karma-cli
$ npm i -g firebase-tools

// Install local packages and type definitions
$ npm install
$ typings install
```

# Testing
```
$ npm test
```

# Launch Develop Server
```
$ npm start
$ open http://localhost:8080/webpack-dev-server/
```

# Setup your firebase config
```
$ firebase login
$ firebase init
// Edit ./src/index.tsx
const firebaseConfig = {
  apiKey:      // Your apiKey,
  authDomain:  // Your authDomain,
  databaseURL: // Your databaseURL,
};
// Edit firebase.json database.rules.json
```

# Build
```
$ npm run build
$ firebase deploy
```
