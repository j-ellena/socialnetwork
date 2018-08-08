console.log('\x1Bc');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const db = require('./db/db');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bc = require('./config/bcrypt');
const csurf = require('csurf');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require('./s3');
const config = require('./config');

// *****************************************************************************
// upload to aws
// *****************************************************************************

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const handleFile = uploader.single('file');

// *****************************************************************************
// middleware
// *****************************************************************************

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: '...my secret cookie session :)',
    maxAge: 1000 * 60 * 60 * 24 * 14
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

// app.use('/favicon.ico', (req, res) => {
//     res.sendStatus(204);
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

// function checkForLog(req, res, next) {
//     if (!req.session.user) {
//         res.redirect('/welcome');
//     } else {
//         if (req.url === '/welcome') {
//             res.redirect('/');
//         } else {
//             next();
//         }
//     }
// }

function checkForLog(req, res, next) {
    !req.session.user
        ? res.redirect('/welcome')
        : next();
}

// *****************************************************************************
// registration route
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
                                        error: 'Sorry, internal server error :('
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
// login route
// *****************************************************************************

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    (!email || !password)

        ? res
            .status(400)
            .json({
                error: 'All fields are required!'
            })

        : db.getPassword(email)
            .then((hashedPassword) => {
                bc.checkPassword(password, hashedPassword)
                    .then(checkedPassword => {
                        if (checkedPassword) {
                            db.getUser(req.body.email)
                                .then(loggedUser => {
                                    req.session.user = loggedUser;
                                    res.end();
                                })
                                .catch(() => {
                                    res
                                        .status(500)
                                        .json({
                                            error: 'Sorry, internal server error :('
                                        });
                                });
                        } else {
                            throw new Error("Password doesn't match!");
                        }
                    })
                    .catch((err) => {
                        res
                            .status(400)
                            .json({
                                error: err.message
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
// user routes
// *****************************************************************************

app.get('/user', checkForLog, (req, res) => {
    db.getUser(req.session.user.email)
        .then(data => {
            res.json({
                ...data,
                image: data.image || '/assets/default.png'
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get('/user/:id.json', (req, res) => {

    (req.session.user.id == req.params.id)

        ? res.json({
            redirect: true
        })

        : db.getUserById(req.params.id)
            .then(data => {
                res.json({
                    ...data,
                    image: data.image || '/assets/default.png'
                });
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });

});

// *****************************************************************************
// image route
// *****************************************************************************

app.post('/image', handleFile, s3.upload, (req, res) => {
    const image = config.s3Url + req.file.filename;

    db.updateImage(req.session.user.id, image)
        .then(() => res.json(image))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

// *****************************************************************************
// bio route
// *****************************************************************************

app.post('/bio', (req, res) => {
    db.updateBio(req.session.user.id, req.body.bio)
        .then(() => {
            res.end();
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

// *****************************************************************************
// friendship routes
// *****************************************************************************

app.get('/friendship/:id', (req, res) => {
    db.checkFriendship(req.session.user.id, req.params.id)
        .then( (data) => {

            let text = '';
            const { status, sender_id } = data;

            if (status === 0) {
                text = 'Make a new friend!';
            } else if (status === 2) {
                text = 'End friendship :(';
            } else if (status === 1) {
                text = req.session.user.id === sender_id
                    ? 'Cancel friend request :|'
                    : 'Accept friendship :)';
            }

            const response = {
                ...data,
                text
            };

            res.json(response);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post('/friendship/:id', (req, res) => {

    const { status } = req.body;

    if (status == 0) {
        db.insertFriendship(req.session.user.id, req.params.id)
            .then( (data) => {
                res.json({
                    ...data,
                    text: 'Cancel friend request :|'
                });
            })
            .catch(() => res.sendStatus(500));

    } else if (status == 2) {
        db.deleteFriendship(req.session.user.id, req.params.id)
            .then( (data) => {
                res.json({
                    ...data,
                    text: 'Make a new friend!'
                });
            })
            .catch(() => res.sendStatus(500));

    } else if (status == 1) {

        if (req.session.user.id == req.body.sender_id) {
            db.deleteFriendship(req.session.user.id, req.params.id)
                .then( (data) => {
                    res.json({
                        ...data,
                        text: 'Make a new friend!'
                    });
                })
                .catch(() => res.sendStatus(500));

        } else {
            db.updateFriendship(req.session.user.id, req.params.id, 2)
                .then( (data) => {
                    res.json({
                        ...data,
                        text: 'End friendship :('
                    });
                })
                .catch(() => res.sendStatus(500));
        }
    }
});

// *****************************************************************************
//  list routes
// *****************************************************************************

app.get('/list', (req, res) => {
    db.getList(req.session.user.id)
        .then( (list) => {
            list.forEach(user => {
                user.image = user.image || '/assets/default.png';
            });
            res.json({list});
        })
        .catch(() => res.sendStatus(500));
});

// *****************************************************************************
//  welcome route
// *****************************************************************************

app.get('/welcome', (req, res) =>
    (req.session.user)
        ? res.redirect('/')
        : res.sendFile(`${__dirname}/index.html`)
    // res.sendFile(`${__dirname}/index.html`)
);

// *****************************************************************************
// logout route
// *****************************************************************************

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/welcome');
});

// *****************************************************************************
// * route
// *****************************************************************************

app.get('*', (req, res) =>
    (!req.session.user)
        ? res.redirect('/welcome')
        : res.sendFile(`${__dirname}/index.html`)
    // res.sendFile(`${__dirname}/index.html`)
);

// *****************************************************************************
// server listening
// *****************************************************************************

server.listen(process.env.PORT || 8080,
    () => console.log('§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§ \n ...listening'));

// *****************************************************************************
// socket stuff
// *****************************************************************************

let onlineUsers = {};

io.on('connection', (socket) => {
    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }

    const socketId = socket.id;
    const userId = socket.request.session.user.id;
    onlineUsers[socketId] = userId;

    db.getUsersByIds(Object.values(onlineUsers))
        .then(data => {
            data.forEach(user => {
                user.image = user.image || '/assets/default.png';
            });
            socket.emit('onlineUsers', data);
        })
        .catch(err => console.log(err));
    if (
        Object.values(onlineUsers).filter(id => id == userId).length == 1
    ) {
        db.getUserById(userId)
            .then(data => socket.broadcast.emit('userJoined', data))
            .catch(err => console.log(err));
    }

    socket.on('disconnect', () => {
        if (
            Object.values(onlineUsers).filter(id => id == userId).length == 1
        ) {
            db.getUserById(userId)
                .then(data => socket.broadcast.emit('userLeft', data))
                .catch(err => console.log(err));
        }
        delete onlineUsers[socketId];
    });

});
