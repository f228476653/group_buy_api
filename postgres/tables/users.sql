IF (!EXISTS (SELECT * 
                 FROM INFORMATION_SCHEMA.TABLES 
                 WHERE TABLE_SCHEMA = 'public' 
                 AND  TABLE_NAME = 'users'))
BEGIN

BEGIN TRANSACTION;

CREATE TABLE users (
    id serial PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email text UNIQUE NOT NULL,
    phonenumber varchar(12) not null,
    password varchar(100) not null,
    joined TIMESTAMP NOT NULL
);

COMMIT;
END