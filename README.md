#  PASSPORT-JS(LOCAL-STRATEGY) Authentication Module

This is a detailed documentaion which will improve with time 
this document covers how does passport.js work for the local 
stratgy.

## Features

- **Strategy Implemented**: local strategy to simply verify the username and the password.

- **Security**: 
    - Password hashing using `crypto`.
    - Session cookie configuration.

## Prerequisites

make sure that the following is installed:
- Node.js
- npm

## installation

1. Clone the reposetry:

    ``` bash
    git clone https://github.com/Odin531/passport.js-doc.git ```

2. change the dir:

    ` cd WEBSITE1 `

3. install the dependencies:

    ` npm install `

4. to start 

    ` npm start `

## explaination

    ``` javascript 
   const express = require("express");
    const path = require("path");
    const session = require("express-session");
    const PgSession = require('connect-pg-simple')(session);
    const { Pool } = require("pg");
    const passport = require("passport");
    const strategy = require("passport-local").Strategy;
    const verify = require("./lib/verify");
    ```
    - session : this is used to creat a session .
    - pgSession : this is used to connect the session to the postgres.
    - Pool : used to query the database which is writen in postgres.
    - passport : to use the passport lib for the authentication.
    - strategy : to deploy the local strategy.
    - verify : there is a function that wheter the given credential is correct or not.

    ``` javascript
    const strat = new strategy(verify);
    passport.use(strat);
    ```
    the first line initialize a new strategy which is local and tell to follow the rule for the verify function which we defeind localy.

    the second line initialize the passport module to use the recently created strategy.

   ``` javascript

    app.use(passport.initialize());
    app.use(passport.session());

    ``` 

    these  are the global middleware used to initialize the passport.js for the perticular server and a passport session that keep track whether the user is logged in or not.

```
# File Structure

WEBSITE/
├── lib/
│   ├── genPassword.js
│   └── verify.js
├── model/
│   └── db.js
├── view/
│   ├── home.html
│   ├── login.html
│   ├── register.html
│   └── sign_up.html
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
└── server.js         

# there is much more to update which will be done later.....
