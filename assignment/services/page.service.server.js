module.exports = function (app, model) {

    var websiteModel = model.websiteModel;
    var pageModel = model.pageModel;

    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    function createPage(req, res) {
        var websiteId = req.params['websiteId'];
        var page = req.body;

        if (page) {
            pageModel
                .createPage(websiteId, page)
                .then(function (page) {
                    websiteModel
                        .findWebsiteById(websiteId)
                        .then(function (website) {
                            website.pages.push(page._id);
                            website.save();
                            res.sendStatus(200);
                        }, function () {
                            res.sendStatus(500);
                        });
                }, function () {
                    res.sendStatus(500)
                });
        } else {
            res.sendStatus(400);
        }
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params['websiteId'];

        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.json(pages);
            }, function () {
               res.sendStatus(500);
            });
    }

    function findPageById(req, res) {
        var pageId = req.params['pageId'];

        pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.json(page);
            }, function () {
                res.sendStatus(500);
            });
    }

    function updatePage(req, res) {
        var pageId = req.params['pageId'];
        var newPage = req.body;

        if (newPage) {
            pageModel
                .updatePage(pageId, newPage)
                .then(function () {
                    res.sendStatus(200);
                }, function () {
                    res.sendStatus(404);
                });
        } else {
            res.sendStatus(400);
        }
    }

    function deletePage(req, res) {
        var pageId = req.params['pageId'];

        pageModel
            .deletePage(pageId)
            .then(function (page) {
                var websiteId = page._website;
                websiteModel
                    .findWebsiteById(websiteId)
                    .then(function (website) {
                        var index = website.pages.indexOf(page._id);
                        website.pages.splice(index, 1);
                        website.save();
                        res.sendStatus(200)
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }
};
