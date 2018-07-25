console.log('\x1Bc');

const express = require('express');
const app = express();
const db = require('./db/db');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bc = require('./config/bcrypt');
// const csurf = require('csurf');

// *****************************************************************************
// middleware
// *****************************************************************************

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(compression());

app.use(
    cookieSession({
        secret: '...my secret cookie session :)',
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

// app.use('/favicon.ico', (req, res) => {
//     res.sendStatus(204);
// });

// app.use(csurf());
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

// app.use((req, res, next) => {
//     res.locals.logged = req.session.user || false;
//     next();
// });

process.env.NODE_ENV != 'production'
    ? app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        }))
    : app.use('/bundle.js', (req, res) =>
        res.sendFile(`${__dirname}/bundle.js`))
;

// *****************************************************************************
// handy functions
// *****************************************************************************

function checkForLog(req, res, next) {
    !req.session.user
        ? res.redirect('/welcome')
        : next();
}

// *****************************************************************************
// post routes
// *****************************************************************************

app.post('/registration', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    (!firstName || !lastName || !email || !password)

        ? res
            .status(400)
            .json({
                error: 'All fields are required!'
            })

        : db.getEmail(email)
            .then(() => {
                bc.hashPassword(password)
                    .then(hashedPassword => {
                        db.insertUser(firstName, lastName, email, hashedPassword)
                            .then(registeredUser => {
                                req.session.user = registeredUser;
                                res.end();
                            })
                            .catch(() => {
                                res
                                    .status(500)
                                    .json({
                                        error: "Sorry, internal server error :("
                                    });
                            });
                    });

            })
            .catch((err) => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    });
            });
});

// *****************************************************************************
// get routes
// *****************************************************************************

app.get(
    '/welcome',
    (req, res) =>
        req.session.user
            ? res.redirect('/')
            : res.sendFile(`${__dirname}/index.html`)
);

app.get('*', checkForLog, (req, res) =>
    res.sendFile(`${__dirname}/index.html`)
);

// *****************************************************************************
// *****************************************************************************

app.listen(process.env.PORT || 8080, () => console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§ \n ...listening'));
