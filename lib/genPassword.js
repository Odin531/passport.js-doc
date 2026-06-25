const crypto = require("crypto");

function genpass(pass) {

    const salt = "very";
    const hashpass = crypto.pbkdf2Sync(pass, salt, 10000, 64, "sha256").toString("hex");

    console.log(salt);
    console.log(hashpass);

    return {
        salt: salt,
        pass: hashpass,
    };

}

module.exports = genpass;
