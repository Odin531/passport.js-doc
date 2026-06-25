const express = require("express");
const path = require("path");
const session = require("express-session");
const PgSession = require('connect-pg-simple')(session);
const { Pool } = require("pg");
const passport = require("passport");
const strategy = require("passport-local").Strategy;
const verify = require("./lib/verify");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const strat = new strategy(verify);
passport.use(strat);

const port = 3000;

const pgpool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "sheet",
  password: "12345678",
  port: "5432",
});

app.use(
  session({
    store: new PgSession({
      pool: pgpool,
      tableName: "session",
    }),
    secret: "secret",
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 days
    // Insert express-session options here
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    // Save the 'sid' column from your user object
    return done(null, user.sid);
  });
});

// 6. Deserialize: Retrieve the user from DB using the 'sid'
passport.deserializeUser(function (sid, done) {
  // Use pgpool.query instead of db.get (which is for SQLite)
  // Query the 'users' table using the 'sid' column
  pgpool.query('SELECT * FROM "users" WHERE "sid" = $1', [sid], function (err, result) {
    if (err) {
      return done(err);
    }
    
    // result.rows contains the user object if found
    if (result.rows.length === 0) {
      return done(null, false);
    }
    const user = result.rows[0]; // Extract the single user object out of the array
    return done(null, user);

      });
});



app.post('/login/password', passport.authenticate('local', {
  successRedirect: '/hello',
  failureRedirect: '/login'
}));

app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname, "./view/login.html"));
});

// 1. GET Route: Serves the register page to the user
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, "./view/register.html")); 
});

// 2. POST Route: Handles the raw SQL query submission and password hashing
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  // Generate a safe unique salt and hash the password (mirroring your genPassword.js logic)
  const crypto = require("crypto");
  const salt = "very";
  const hashpass = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha256").toString("hex");
  
  // Generate a random unique 'sid' string for session management serialization
  const sid = crypto.randomUUID(); 

  // Raw PostgreSQL Query to insert the new user record
  // (Adjust column names like username, pass, salt, sid if they differ in your DB)
  const queryText = 'INSERT INTO "users" (username, pass, salt, sid) VALUES ($1, $2, $3, $4)';
  const values = [username, hashpass, salt, sid];

  pgpool.query(queryText, values, (err, result) => {
    if (err) {
      console.error("Registration error:", err);
      // Handles potential duplicate username constraint errors gracefully
      if (err.code === '23505') { 
        return res.status(400).send("Username already exists.");
      }
      return res.status(500).send("An error occurred during registration.");
    }
    
    // Redirect to login page upon a successful registration
    res.redirect('/login');
  });
});

app.get("/hello", (req,res)=>{
  if(req.isAuthenticated()){
    res.send(`<h1> this is the authenticated ${req.user.username} </h1>`);

  }else{
      res.send(`<h1> this is not allowed </h1>`);
}});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.listen(port, () => {
  console.log("ative on port ---->  " + port);
});
