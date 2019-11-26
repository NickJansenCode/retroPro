/* eslint-disable no-undef */
// NPM IMPORTS //
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

// ROUTE IMPORTS //
const users = require('./routes/api/users');
const games = require('./routes/api/game');
const platforms = require('./routes/api/platform');
const recoveryQuestions = require('./routes/api/recoveryQuestion');
const roles = require('./routes/api/role');
const reports = require("./routes/api/reports")

// GLOBALS //
const port = 5000;

// Initialize the application and configure passport. //
const app = express()
    .use(
        bodyParser.urlencoded({ extended: false, }),
        bodyParser.json(),
        passport.initialize()
    )
require('./config/passport')(passport);

// Connect to mongoDB. //
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB succesfully connected.'))
    .catch((err) => console.log(err));

// Register API Routes //
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/platforms', platforms);
app.use('/api/recoveryQuestions', recoveryQuestions);
app.use('/api/roles', roles);
app.use("/api/reports", reports)

// If we are in production, serve all requests using the client/build directory.
if (process.env.ENVIRONMENT == 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => { res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); });
}

app.listen(port, () => console.log(`Server running on port ${port}!`));

// Export for testing. //
module.exports = app; 