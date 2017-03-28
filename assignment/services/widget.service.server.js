module.exports = function(app, model) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var pageModel = model.pageModel;
    var widgetModel = model.widgetModel;

    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.put("/api/page/:pageId/widget", updateWidgetOrdering);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    function createWidget(req, res) {
        var pageId = req.params['pageId'];
        var widget = req.body;

        widgetModel
            .createWidget(pageId, widget)
            .then(function (widget) {
                pageModel
                    .findPageById(pageId)
                    .then(function (page) {
                        page.widgets.push(widget._id);
                        page.save();
                        res.json(widget);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function (err) {
                console.log(err);
               res.sendStatus(500)
            });
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params['pageId'];

        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                res.json(widgets);
            }, function () {
               res.sendStatus(500)
            });
    }

    function updateWidgetOrdering(req, res) {
        var pageId = req.params['pageId'];
        var initialIndex = req.query['initial'];
        var finalIndex = req.query['final'];

        widgets.splice(finalIndex, 0, widgets.splice(initialIndex, 1)[0]);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];

        widgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                res.json(widget);
            }, function () {
                res.sendStatus(404);
            });
    }

    function updateWidget(req, res) {
        var widgetId = req.params['widgetId'];
        var newWidget = req.body;

        if (newWidget) {
            widgetModel
                .updateWidget(widgetId, newWidget)
                .then(function () {
                    res.sendStatus(200);
                }, function () {
                    res.sendStatus(404);
                });
        } else {
            res.sendStatus(400);
        }
    }

    function deleteWidget(req, res) {
        var widgetId = req.params['widgetId'];

        widgetModel
            .deleteWidget(widgetId)
            .then(function (widget) {
                var pageId = widget._page;
                pageModel
                    .findPageById(pageId)
                    .then(function (page) {
                        var index = page.widgets.indexOf(widgetId._id);
                        page.widgets.splice(index, 1);
                        page.save();
                        res.sendStatus(200)
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }

    function uploadImage(req, res) {
        var userId = req.body.userId;
        var websiteId = req.body.websiteId;
        var pageId = req.body.pageId;
        var widgetId = req.body.widgetId;

        var myFile = req.file;
        var filename = myFile.filename;     //file path

        var widget = {
            "_id": widgetId,
            "pageId": pageId,
            "widgetType": "IMAGE",
            "width": "100%",
            "url": "/uploads/" + filename
        };

        widgetModel
            .updateWidget(widgetId, widget)
            .then(function () {
                res.redirect(301, "/assignment/index.html#" +
                    "/user/" + userId +
                    "/website/" + websiteId +
                    "/page/" + pageId +
                    "/widget");
            }, function () {
                res.sendStatus(500);
            });
    }
};