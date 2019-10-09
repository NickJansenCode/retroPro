// Dependencies. //
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const games = require("./routes/api/game");
const platforms = require("./routes/api/platform");
const cors = require("cors");
const path = require("path")

// Initialize the application. //
const app = express();

// Bodyparser middleware. //
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client/build")))
// Connect to mongoDB. //
const db = require("./config/keys").mongoURI;

mongoose.connect(
    db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log("MongoDB succesfully connected."))
.catch(err => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);

// Routes. //
app.use("/api/users", users);
app.use("/api/games", games);
app.use("/api/platforms", platforms);

const port = process.env.PORT || 5000;

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}!`));