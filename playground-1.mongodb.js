// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const { find } = require("./src/models/User");

// The current database to use.
use("service-management");

const user = await find({})


console.log(user);

