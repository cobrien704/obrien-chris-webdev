module.exports = function(app, model) {

    var userModel = model.userModel;

    app.post("/api/user", createUser );
    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    function createUser(req, res) {
        var user = req.body;

        if (user) {
            userModel
                .createUser(user)
                .then(function (user) {
                    res.json(user);
                }, function (err) {
                    if (err.code === 10000) {
                        res.status(409);
                    } else {
                        res.status(500);
                    }
                });
        } else {
                res.status(400);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query['username'];

        userModel
            .findUserByUsername(username)
            .then(function(user) {
                res.json(user);
            }, function() {
                res.send(500);
            });
    }

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];

        userModel
            .findUserByCredentials(username, password)
            .then(function(user) {
                res.json(user);
            },function() {
                res.sendStatus(500);
            });
    }

    function findUserById(req, res) {
        var userId = req.params['userId'];

        userModel
            .findUserById(userId)
            .then(function(user) {
                if (user) {
                    res.json(user);
                } else {
                    res.sendStatus(404);
                }
            },function () {
                res.sendStatus(500);
            })
    }

    function updateUser(req, res) {
        var userId = req.params['userId'];
        var newUser = req.body;

        userModel
            .updateUser(userId, newUser)
            .then(function() {
               res.sendStatus(200);
            },function() {
                res.sendStatus(500);
            });
    }

    function deleteUser(req, res) {
        var userId = req.params['userId'];

        userModel
            .deleteUser(userId)
            .then(function() {
                res.sendStatus(200);
            }, function () {
                res.sendStatus(500);
            });
    }
};
