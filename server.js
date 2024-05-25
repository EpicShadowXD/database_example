const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Initialize Express
const app = express();
app.use(express.json());

// Connect to SQLite database (store on disk)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // Database file path
});

// Define User model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = await User.create({
            username: username,
            password: hashedPassword
        });

        res.send('Registration successful. You can now login.');
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).send('Username already exists. Please choose a different one.');
        }
        res.status(500).send('An error occurred while registering.');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user in the database
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).send('Invalid username or password. Please try again.');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).send('Invalid username or password. Please try again.');
    }

    res.send('Login successful. Welcome back, ' + username + '!');
});

// Sync the database (create tables)
sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
        // Start the server
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to sync database:', err);
    });
