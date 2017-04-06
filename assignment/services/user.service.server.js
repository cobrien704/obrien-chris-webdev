module.exports = function(app, model) {

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");

    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : process.env.GOOGLE_CALLBACK_URL
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new LocalStrategy(localStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var userModel = model.userModel;

    app.post("/api/user", createUser );
    app.get("/api/user", findUserByCredentials);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.post ('/api/register', createUser);
    app.post ('/api/login', passport.authenticate('local'), login);
    app.get ('/api/loggedin', loggedin);
    app.post('/api/logout', logout);
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/assignment/#/login'
        }), function(req, res){
            var url = '/assignment/#/user/' + req.user._id.toString();
            res.redirect(url);
        });

    function createUser(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);

        userModel
            .createUser(user)
            .then(function (user) {
                if (user) {
                    req.login(user, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
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

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if(user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function(err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel
                            .createUser(newGoogleUser)
                            .then(function (user) {
                                return done(null, user);
                            });
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                });
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

};
