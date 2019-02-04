const express = require('express')
const app = express();
const port = 3000
require('dotenv').config();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(cookieParser());

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var checkAuth = (req, res, next) => {
    console.log("Checking authentication");
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        req.user = null;
    } else {
        var token = req.cookies.nToken;
        var decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }

    next();
};

app.use(checkAuth);

// Add after body parser initialization!
app.use(expressValidator());

require('./data/reddit-db');
require('./controllers/posts')(app)
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

var exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

module.exports = app;

app.listen(port, () => console.log(`App listening on port ${port}!`))
