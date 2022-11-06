const moongoose = require("mongoose");

const userSchema = new moongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

const UserModel = moongoose.model("user", userSchema);

module.exports = {UserModel}