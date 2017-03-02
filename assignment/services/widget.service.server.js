var multer = require('multer');
var upload = multer({ dest: __dirname+'/../../public/uploads' });

module.exports = function(app) {
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.put("/api/page/:pageId/widget", updateWidgetOrdering);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "http://lorempixel.com/400/200/"},
        { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"},
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://www.youtube.com/embed/AM2Ivdi9c4E" },
        { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];

    function createWidget(req, res) {
        var pageId = req.params['pageId'];
        var type = req.query['type'].toUpperCase();

        var newWidget = {
            "_id": (new Date()).getTime() + "",
            "widgetType": type,
            "pageId": pageId
        };

        widgets.push(newWidget);
        res.json(newWidget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params['pageId'];
        var pageWidgets = [];

        widgets.find(function(w) {
            if (w.pageId == pageId) {
                pageWidgets.push(w);
            }
        });

        res.json(pageWidgets);
    }

    function updateWidgetOrdering(req, res) {
        var pageId = req.params['pageId'];
        var initialIndex = req.query['initial'];
        var finalIndex = req.query['final'];

        widgets.splice(finalIndex, 0, widgets.splice(initialIndex, 1)[0]);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];

        var widget = widgets.find(function(w) {
            return w._id == widgetId;
        });

        if (widget) res.json(widget);
        else res.sendStatus(404);
    }

    function updateWidget(req, res) {
        var widgetId = req.params['widgetId'];
        var newWidget = req.body;

        var oldWidget = widgets.find(function(w) {
            return w._id == widgetId;
        });

        if (oldWidget) {
            if (oldWidget.widgetType == "HEADING") {
                oldWidget.text = newWidget.text;
                oldWidget.size = newWidget.size;
            } else if (oldWidget.widgetType == "YOUTUBE" || oldWidget.widgetType == "IMAGE") {
                oldWidget.width = newWidget.width;
                oldWidget.url = newWidget.url;
            } else if (oldWidget.widgetType == "HTML") {
                oldWidget.text = newWidget.text;
            }

            res.sendStatus(200);
        }
        else {
            res.sendStatus(409);
        }
    }

    function deleteWidget(req, res) {
        var widgetId = req.params['widgetId'];

        for (var w in widgets) {
            if (widgets[w]._id == widgetId) {
                widgets.splice(w, 1);
                res.sendStatus(200);
                return
            }
        }
        res.sendStatus(404);
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

        widgets.push(widget);

        res.redirect(301, "/assignment/index.html#" +
            "/user/" + userId +
            "/website/" + websiteId +
            "/page/" + pageId +
            "/widget");
    }
};