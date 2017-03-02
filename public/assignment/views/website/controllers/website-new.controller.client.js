(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {
            var promise = WebsiteService.findWebsitesByUser(vm.userId);
            promise.success(function (websites) {
                vm.websites = websites;
            });
        }
        init();

        vm.createWebsite = createWebsite;

        function createWebsite(website) {
            var promise = WebsiteService.createWebsite(vm.userId, website);
            promise.success(function(website) {
                $location.url("/user/" + vm.userId + "/website");
            });
        }
    }
})();