const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage (or use a file-based JSON storage)
const usersFile = path.join(__dirname, 'users.json');

// Ensure users.json exists
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Routes
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const users = JSON.parse(fs.readFileSync(usersFile));
    users.push({ username, password });
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.status(201).send('User registered successfully.');
});

// Route to get all registered users
app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(usersFile));
    res.json(users);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
