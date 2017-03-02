(function () {
    angular
        .module("WebAppMaker")
        .controller("PageEditController", PageEditController);

    function PageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            var pagesPromise = PageService.findPageByWebsiteId(vm.websiteId);
            pagesPromise.success(function(pages) {
                vm.pages = pages;
            });

            var pageEditPromise = PageService.findPageById(vm.pageId);
            pageEditPromise.success(function(page) {
                vm.page = page;
            })
        }
        init();

        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function deletePage() {
            var deletePagePromise = PageService.deletePage(vm.pageId);
            deletePagePromise.success(function() {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            });
        }

        function updatePage(newPage) {
            var updatePagePromise = PageService.updatePage(vm.pageId, newPage);
            updatePagePromise.success(function() {
                $location.url("/user/" + vm.userId + "/website/" + vm.websiteId + "/page");
            });
        }
    }
})();