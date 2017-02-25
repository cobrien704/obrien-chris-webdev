(function () {
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController);

    function WidgetListController($routeParams, $sce, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
        }
        init();
        vm.trustUrl = trustUrl;
        vm.getTrustHtml = getTrustHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;

        function getWidgetTemplateUrl(type) {
            return 'views/widgets/templates/widget-' + type + '.view.client.html';
        }

        function getTrustHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function trustUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }
    }
})();