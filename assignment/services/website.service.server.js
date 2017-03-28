module.exports = function(app, model) {

    var userModel = model.userModel;
    var websiteModel = model.websiteModel;

    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);


    function createWebsite(req, res) {
        var userId = req.params['userId'];
        var website = req.body;

        if (website) {
            websiteModel
                .createWebsiteForUser(userId, website)
                .then(function (site) {
                    userModel
                        .findUserById(userId)
                        .then(function (user) {
                            user.websites.push(site._id);
                            user.save();
                            res.sendStatus(200);
                        }, function () {
                            res.sendStatus(500);
                        });
                }, function () {
                    res.sendStatus(500);
                });
        } else {
            res.sendStatus(400);
        }
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params['userId'];

        websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                res.json(websites);
            }, function () {
                res.sendStatus(500);
            });
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];

        websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                res.json(website);
            }, function () {
                res.sendStatus(404);
            });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        var newWebsite = req.body;

        if (newWebsite) {
            websiteModel
                .updateWebsite(websiteId, newWebsite)
                .then(function () {
                    res.sendStatus(200);
                }, function () {
                    res.status(404);
                });
        } else {
            res.sendStatus(400);
        }
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];

        websiteModel
            .deleteWebsite(websiteId)
            .then(function (website) {
                var userId = website._user;

                userModel
                    .findUserById(userId)
                    .then(function (user) {
                        var index = user.websites.indexOf(website._id);
                        user.websites.splice(index, 1);
                        user.save();
                        res.sendStatus(200);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }
};
