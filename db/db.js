const spicedPg = require('spiced-pg');

let db;
(process.env.DATABASE_URL)
    ? db = spicedPg(process.env.DATABASE_URL)
    : db = spicedPg('postgres:postgres:postgres@localhost:5432/socialnetwork')
;

// *****************************************************************************
// registration queries
// *****************************************************************************

exports.insertUser = (firstName, lastName, email, hashedPassword) => {
    const params = [firstName, lastName, email, hashedPassword];
    const q = `
             INSERT INTO users
                (first_name, last_name, email, hashed_password)
                VALUES ($1, $2, $3, $4)
                RETURNING id, first_name, last_name, email;
              `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.insertUser error: \n', err);
            throw err;
        });
};

exports.getEmail = email => {
    const params = [email];
    const q = `
            SELECT *
                FROM users
                WHERE email = $1;
            `;
    return db.query(q, params)
        .then(results => {
            if (results.rows[0] !== undefined)
                throw new Error('This email is already registered!');
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.getEmail error: \n', err);
            throw err;
        });
};

// *****************************************************************************
// login queries
// *****************************************************************************

exports.getPassword = email => {
    const params = [email];
    const q = `
            SELECT hashed_password
                FROM users
                WHERE email = $1;
            `;
    return db.query(q, params)
        .then(results => {
            if (results.rows[0] === undefined)
                throw new Error('Email not found!');
            return results.rows[0].hashed_password;
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.getPassword error: \n', err);
            throw err;
        });
};

exports.getUser = email => {
    const params = [email];
    const q = `
            SELECT id, first_name, last_name, email, image, bio
                FROM users
                WHERE email = $1;
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.getUser error: \n', err);
            throw err;
        });
};

// *****************************************************************************
// uploader queries
// *****************************************************************************

exports.updateImage = (id, image) => {
    const params = [id, image];
    const q = `
            UPDATE users
                SET image = $2
                WHERE id = $1
                RETURNING *;
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0].image;
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.updateImage error: \n', err);
            throw err;
        });
};

// *****************************************************************************
// bio queries
// *****************************************************************************

exports.updateBio = (id, bio) => {
    const params = [id, bio];
    const q = `
            UPDATE users
                SET bio = $2
                WHERE id = $1
                RETURNING *;
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0].bio;
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.updateBio error: \n', err);
            throw err;
        });
};

// *****************************************************************************
//  other queries
// *****************************************************************************

exports.getOther = id => {
    const params = [id];
    const q = `
            SELECT id, first_name, last_name, email, image, bio
                FROM users
                WHERE id = $1;
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.getOther error: \n', err);
            throw err;
        });
};

// *****************************************************************************
// friendships queries
// *****************************************************************************

exports.checkFriendship = (senderId, receiverId) => {
    const params = [senderId, receiverId];
    const q = `
            SELECT status, sender_id, receiver_id
                FROM friendships
                WHERE ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))
                    AND (status = 1 OR status = 2);
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0]
                ? results.rows[0]
                : {
                    status: 0,
                    sender_id: 0,
                    receiver_id: 0
                };
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.checkFriendship error: \n', err);
            throw err;
        });
};

exports.insertFriendship = (senderId, receiverId) => {
    const params = [senderId, receiverId];
    const q = `
            INSERT INTO friendships
                (sender_id, receiver_id)
                VALUES ($1, $2)
                RETURNING status, sender_id, receiver_id;
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.insertFriendship error: \n', err);
            throw err;
        });
};

exports.deleteFriendship = (senderId, receiverId) => {
    const params = [senderId, receiverId];
    const q = `
            DELETE FROM friendships
                WHERE ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))
            `;
    return db.query(q, params)
        .then(() => {
            return {
                status: 0,
                sender_id: 0,
                receiver_id: 0
            };
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.deleteFriendship error: \n', err);
            throw err;
        });
};

exports.updateFriendship = (senderId, receiverId, status) => {
    const params = [senderId, receiverId, status];
    const q = `
            UPDATE friendships
                SET status = $3, updated_at = CURRENT_TIMESTAMP
                WHERE ((sender_id = $1 AND receiver_id = $2)
                    OR (sender_id = $2 AND receiver_id = $1))
                RETURNING status, sender_id, receiver_id;
            `;
    return db.query(q, params)
        .then(results => {
            return results.rows[0];
        })
        .catch(err => {
            console.log('§§§§§§§§§§§§§§ db.updateFriendship error: \n', err);
            throw err;
        });
};

// *****************************************************************************
//
// *****************************************************************************
