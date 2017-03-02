(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetEditController", WidgetEditController);

    function WidgetEditController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];

        function init() {
            var promise = WidgetService.findWidgetById(vm.widgetId);
            promise.success(function(widget) {
                vm.widget = widget;
            });
        }
        init();

        vm.deleteWidget = deleteWidget;
        vm.updateWidget = updateWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;

        function getEditorTemplateUrl(type) {
            return 'views/widgets/templates/editors/widget-' + type.toLowerCase() + '-editor.view.client.html';
        }

        function deleteWidget() {
            var deleteWidgetPromise = WidgetService.deleteWidget(vm.widgetId);
            deleteWidgetPromise.success(function() {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            });
        }

        function updateWidget(newWidget) {
            var updateWidgetPromise = WidgetService.updateWidget(vm.widgetId, newWidget);
            updateWidgetPromise.success(function() {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page/" + vm.pageId + "/widget");
            });
        }
    }
})();