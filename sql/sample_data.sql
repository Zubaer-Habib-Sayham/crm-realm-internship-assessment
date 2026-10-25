
CREATE TABLE leads (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100)
);

INSERT INTO leads (name, email, score) VALUES
    ('Alice', 'alice@example.com', 0),
    ('Bob', 'bob@example.com', 49),
    ('Charlie', 'charlie@example.com', 50),
    ('David', 'david@example.com', 79),
    ('Eve', 'eve@example.com', 80),
    ('Farah', 'farah@example.com', 100);
