module.exports = function(app) {
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    var websites = [
        { "_id": "123", "name": "Facebook",    "developerId": "456", "description": "Lorem" },
        { "_id": "234", "name": "Tweeter",     "developerId": "456", "description": "Lorem" },
        { "_id": "456", "name": "Gizmodo",     "developerId": "456", "description": "Lorem" },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem" },
        { "_id": "678", "name": "Checkers",    "developerId": "123", "description": "Lorem" },
        { "_id": "789", "name": "Chess",       "developerId": "234", "description": "Lorem" }
    ];

    function createWebsite(req, res) {
        var userId = req.params['userId'];
        var website = req.body;

        var newWebsite = {
            "_id": (new Date()).getTime() + "",
            "name": website.name,
            "developerId": userId,
            "description": website.description
        };

        websites.push(newWebsite);
        res.sendStatus(200);
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params['userId'];
        var userSites = [];

        websites.find(function(w) {
            if (w.developerId == userId) {
                userSites.push(w);
            }
        });

        res.json(userSites);
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];

        var website = websites.find(function(w) {
            return w._id == websiteId;
        });

        if (website) res.json(website);
        else res.sendStatus(404);
    }

    function updateWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        var newWebsite = req.body;

        var oldWebsite = websites.find(function(w) {
            return w._id == websiteId;
        });

        if (oldWebsite) {
            oldWebsite.name = newWebsite.name;
            oldWebsite.description = newWebsite.description;

            res.sendStatus(200);
        }
        else {
            res.sendStatus(409);
        }
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params['websiteId'];

        for (var w in websites) {
            if (websites[w]._id == websiteId) {
                websites.splice(w, 1);
                res.sendStatus(200);
                return
            }
        }
        res.sendStatus(404);
    }
};