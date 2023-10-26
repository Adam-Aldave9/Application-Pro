const mong = require("mongoose");
const userSchema = new mong.Schema({
    username: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true},
    jobs: {type: [], required: false}
});

module.exports = mong.model("User", userSchema);