const express = require('express');
const router = express.Router();
const User = require('../db/Models/userModel').User;
const Leaderboard = require('../db/Models/leaderboardModel').leaderboard;
const db = require('../db/database.js')
const axios = require('axios');
const userMock = require('../user_mock.json')
const authMock = require('../auth_mock.json')
const leaderboardMock = require('../leaderboard_mock.json')

require('dotenv').config();

/* Route */

router.use('/api', express.json(), (req, res, next) => {
    next();
});


router.get('/api/user/:token', (req, res) => {
    const token = req.params.token
    db.getUserById(User, token)
        .then(user => {
            console.log(user)
            res.status(200).json({ user: user })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.get('/api/users', (req, res) => {
    db.getAllUsers(User)
        .then(users => {
            res.status(200).json({ users: users })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.get('/api/top-players', (req, res) => {
    db.getTop10Player(Leaderboard)
        .then(topPlayers => {
            res.status(200).json({ topPlayers: topPlayers })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.get('/api/top-house', (req, res) => {
    db.getTopHouse(Leaderboard)
        .then(houses => {
            res.status(200).json({ houses: houses })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.post('/api/user', (req, res) => {
    /* This is a user mock for testing*/
    //const newUser = userMock
    const newUser = new User(req.body);
    db.createOrUpdateUser(User, newUser)
        .then(savedUser => {
            console.log(savedUser);
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.post('/api/login', async (req, res) => {
    try {
        /* This is a mock for testing auth*/
        //const { name, password } = authMock;
        const { name, password } = req.body;
        const response = await axios.post(`${process.env.IIM_API_URL}/auth/log-in`, { name, password }, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        console.log(error)
        res.status(error.response?.status || 500).json(error.response?.data || { message: 'An error occurred' });
    }
});

router.post('/api/:status/:userid', async (req, res) => {
    const userId = req.params.userid;
    const status = req.params.status;

    if (!userId) {
        console.log("erreur1")
        res.status(400).send('Missing userId parameter');
        return;
    }
    if (!status) {
        console.log("erreur2")
        res.status(400).send('Missing status parameter. Please fill "victory" or "loose"');
        return;
    }
    if (!['victory', 'loose'].includes(status)) {
        console.log("erreur3")
        res.status(400).send('Status parameters not understand. Please fill "victory" or "loose"');
        return;
    }
    let user = null;
    let victory = null;
    let loose = null;
    let newUserOnBoard = null;
    if (status === 'victory') {
        victory = 1;
    } else if (status === 'loose') {
        loose = 1;
    }
    await db.getUserById(User, userId)
        .then(userFound => {
            if (userFound) {
                user = userFound;
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal server error');
        });
    if (user === null) {
        res.status(500).send('User not found, please verify your token');
        return;
    }
    if (user != null && victory != null) {
        newUserOnBoard = new Leaderboard({user, "victory": victory, "loose": 0});
    } else if (user != null && loose !== null) {
        newUserOnBoard = new Leaderboard({user, "victory": 0, "loose": loose});
    } else {
        res.status(500).send('Internal Server Error');
        return
    }
    db.updateLeaderboard(Leaderboard, newUserOnBoard, victory !== null)
        .then(newBoard => {
            console.log(newBoard);
            res.sendStatus(200);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
});

module.exports = router;