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
//  
// *****************************************************************************
