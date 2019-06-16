DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL CHECK(first_name!=''),
    last_name VARCHAR(50) NOT NULL CHECK(last_name!=''),
    email VARCHAR(50) NOT NULL CHECK(email!='') UNIQUE,
    hashed_password VARCHAR(100) NOT NULL CHECK(hashed_password!=''),
    image VARCHAR(300),
    bio VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- status 1 = pending
-- status 2 = accepted
-- CANCEL or UNFRIEND => DELETE the row
-- bonuse statuses:
-- rejected, cancelled, terminated
