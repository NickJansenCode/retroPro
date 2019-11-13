// Dependencies. //
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const games = require('./routes/api/game');
const platforms = require('./routes/api/platform');
const recoveryQuestions = require('./routes/api/recoveryQuestion');

const path = require('path');
const port = 5000;
require('dotenv').config();

// Initialize the application. //
const app = express();

// Bodyparser middleware. //
app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
);

app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB succesfully connected.'))
    .catch((err) => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

// Routes. //
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/platforms', platforms);
app.use('/api/recoveryQuestions', recoveryQuestions);

// If we are in production, serve all requests using the client/build directory.
if (process.env.ENVIRONMENT == 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


app.listen(port, () => console.log(`Server running on port ${port}!`));
