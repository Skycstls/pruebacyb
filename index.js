const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
app.use(express.json());

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

const users = {};

// Inicializar usuarios
const initialUsers = [
    { username: 'tangela', password: 'secret456' },
    { username: 'eevee', password: 'evolution', mensajes: [
        { id: 1, texto: 'Hola! Bienvenido, no eres el unico que se registró como un pokemon :) somos bastantes!', user: 'tangela' },
        { id: 2, texto: 'Gracias, Tangela! Me alegra saber que no soy el único.', user: 'eevee' },
        { id: 3, texto: '¿Alguien sabe cuándo será la próxima actualización del servidor?', user: 'eevee' }
    ] },
    { username: 'pikachu', password: 'thunderbolt', mensajes: [
        { id: 1, texto: 'Has visto? Hay un usuario que se registró como un pokemon tambien! Se llama eevee', user: 'tangela' },
        { id: 2, texto: 'Sabes cuando pondran un tablon global para que todos podamos hablar?', user: 'pikachu' },
        { id: 3, texto: 'Hola!', user: 'devhell' },
        { id: 4, texto: 'Hola Eevee! Bienvenido al grupo!', user: 'pikachu' },
        { id: 5, texto: 'Hola Pikachu! Gracias por la bienvenida.', user: 'eevee' }
    ]},
    { username: 'charmander', password: 'fire123', mensajes: [
        { id: 1, texto: 'Hola a todos! ¿Qué tal?', user: 'charmander' },
        { id: 2, texto: 'Hola Charmander! Todo bien, ¿y tú?', user: 'tangela' },
        { id: 3, texto: 'Bien también, gracias! ¿Alguien ha probado el nuevo juego de Pokémon?', user: 'charmander' }
    ]},
    { username: 'admin', password: 'ilovesummer', mensajes: [
        { id: 1, texto: 'Recuerden seguir las reglas del servidor, por favor.', user: 'admin' },
        { id: 2, texto: 'Claro, admin! Gracias por el recordatorio.', user: 'pikachu' }
    ]},
    { username: 'guest', password: 'welcome123' },
    { username: 'user142', password: 'password' },
    { username: 'user140', password: 'password' },
    { username: 'user023', password: 'password' },
    { username: 'user001', password: 'password' },
    { username: 'test', password: '1234' },
    { username: 'demo', password: '' },
    { username: 'devhell', password: '1337', mensajes: [
        { id: 1, texto: 'Hola a todos! Soy nuevo aquí.', user: 'devhell' },
        { id: 2, texto: 'Bienvenido, devhell!', user: 'eevee' },
        { id: 3, texto: 'Gracias, eevee! ¿Qué tal está el ambiente por aquí?', user: 'devhell' },
    ]}
];

(async () => {
    for (const user of initialUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        users[user.username] = hashedPassword;
    }
})();

// Ruta para login de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = users[username];

    if (!hashedPassword) {
        return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', username });
});

// Ruta para obtener los mensajes del usuario autenticado
app.get('/messages', (req, res) => {
    const { username } = req.query;

    const user = initialUsers.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ mensajes: user.mensajes || [] });
});

app.get('/last-user', (req, res) => {
    const lastUser = initialUsers[initialUsers.length - 1];
    if (!lastUser) {
        return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json({ username: lastUser.username });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
