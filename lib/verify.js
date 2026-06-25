const db = require("../model/db"); // Ensure this is exporting your pg pool/client instance
const genpass = require("./genPassword");

async function verify(username, password, done) {
  try {
    // 1. Added await to properly resolve the promise
    // 2. Fixed column name to match 'username' from your registration setup
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    
    // 3. Check if any user was actually returned in the rows array
    if (result.rows.length === 0) {
      return done(null, false, { message: "User not found" });
    }

    const user = result.rows[0];

    // 4. Generate the hash from the incoming password
    const hashedPass = genpass(password).pass;

    // 5. Match the strings securely
    if (user.pass !== hashedPass) {
      return done(null, false, { message: "Password incorrect" });
    }

    // Success! Pass the user object forward to serializeUser
    return done(null, user);
    
  } catch (err) {
    return done(err);
  }
}

module.exports = verify;