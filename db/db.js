const spicedPg = require('spiced-pg');

let db;
(process.env.DATABASE_URL)
    ? db = spicedPg(process.env.DATABASE_URL)
    : db = spicedPg('postgres:postgres:postgres@localhost:5432/socialnetwork')
;

// *****************************************************************************
// users table queries
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
        .catch(error => {
            console.log('§§§§§§§§§§§§§§ db.insertUser error: \n', error);
            throw error;
        });
};

exports.getEmail = email => {
    const params = [email];
    const q = `
            SELECT * FROM users WHERE email = $1;
            `;
    return db.query(q, params)
        .then(results => {
            if (results.rows[0] !== undefined)
                throw new Error('This email is already registered!');
        })
        .catch(error => {
            console.log('§§§§§§§§§§§§§§ db.getEmail error: \n', error);
            throw error;
        });
};

// *****************************************************************************
//
// *****************************************************************************
