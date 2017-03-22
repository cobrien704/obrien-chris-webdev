(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetNewController", WidgetNewController);

    function WidgetNewController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var promise = WidgetService.findWidgetsByPageId(vm.pageId);
            promise.success(function(widgets) {
                vm.widgets = widgets;
            });
        }
        init();

        vm.createWidget = createWidget;

        function createWidget(type) {
            var createWidgetPromise = WidgetService.createWidget(vm.pageId, type);
            createWidgetPromise.success(function(widget) {
                $location.url("/user/" + vm.userId +
                    "/website/" + vm.websiteId +
                    "/page/" + vm.pageId +
                    "/widget/" + widget._id);
            })
        }
    }
})();