const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = {};

// Inicializar usuarios
const initialUsers = [
    { username: 'tangela', password: 'secret456' },
    { username: 'pikachu', password: 'mypassword789' },
    { username: 'charmander', password: 'ilovesummer' },
    { username: 'squirtle', password: 'password123' },
    { username: 'bulbasaur', password: 'imaseed' },
    { username: 'jigglypuff', password: '123456' },
    { username: 'meowth', password: 'teamrocket' },
    { username: 'psyduck', password: 'confusion' },
    { username: 'snorlax', password: 'zzz' },
    { username: 'magikarp', password: 'useless' },
    { username: 'eevee', password: 'evolution' }
];

(async () => {
    for (const user of initialUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        users[user.username] = hashedPassword;
    }
})();

// Obtener usuarios por nombre de usuario
app.get('/users/:username', (req, res) => {
    const { username } = req.params;
    const user = users[username];

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ username });
});

// Ruta para registrar un usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = hashedPassword;

    res.status(201).json({ message: 'User created successfully' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});