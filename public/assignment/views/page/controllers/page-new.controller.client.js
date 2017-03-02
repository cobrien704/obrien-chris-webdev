(function () {
    angular
        .module("WebAppMaker")
        .controller("PageNewController", PageNewController);

    function PageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var promise = PageService.findPageByWebsiteId(vm.websiteId);
            promise.success(function(pages) {
                vm.pages = pages;
            });
        }
        init();

        vm.createPage = createPage;

        function createPage(newPage) {
            var newPagePromise = PageService.createPage(vm.websiteId, newPage);
            newPagePromise.success(function() {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            });
        }

    }
})();