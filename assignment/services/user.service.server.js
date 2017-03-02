'use strict';

module.exports = function(app) {
    app.post("/api/user", createUser );
    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var users = [
        { _id: '123', username: 'alice',    password: 'alice',    firstName: 'Alice',  lastName: 'Wonder', email: 'alice@email.com'  },
        { _id: '234', username: 'bob',      password: 'bob',      firstName: 'Bob',    lastName: 'Marley', email: 'bob@email.com'  },
        { _id: '345', username: 'charly',   password: 'charly',   firstName: 'Charly', lastName: 'Garcia', email: 'charly@email.com'  },
        { _id: '456', username: 'jannunzi', password: 'jannunzi', firstName: 'Jose',   lastName: 'Annunzi', email: 'jannunzi@email.com' }
    ];

    function createUser(req, res) {
        var user = req.body;
        var newUser = {
            "_id": (new Date()).getTime() + "",
            "username": user.username,
            "password": user.password,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email
        };

        users.push(newUser);
        res.json(newUser);
    }

    function findUserByUsername(req, res) {
        var username = req.query['username'];

        var user = users.find(function (u) {
            return u.username == username;
        });

        if (user) req.send(user);
        else findUserByCredentials(req, res);
    }

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        var user = users.find(function (u) {
            return u.username == username &&
                    u.password == password;
        });

        if (user) res.json(user);
        else res.sendStatus(404);
    }

    function findUserById(req, res) {
        var userId = req.params['userId'];

        var user = users.find(function(u) {
            return u._id == userId;
        });

        if (user) res.json(user);
        else res.sendStatus(404);
    }

    function updateUser(req, res) {
        var userId = req.params['userId'];
        var newUser = req.body;

        var oldUser = users.find(function(u) {
            return u.userId == userId;
        });

        if(oldUser) {
            oldUser.firstName = newUser.firstName;
            oldUser.lastName = newUser.lastName;

            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    }

    function deleteUser(req, res) {
        var userId = req.params['userId'];

        for (var u in users) {
            if (users[u]._id == userId) {
                users.splice(u, 1);
                res.sendStatus(200);
                return
            }
        }
        res.sendStatus(404);
    }
};
