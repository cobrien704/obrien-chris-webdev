(function () {
    angular
        .module("WebAppMaker")
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {
            var websitesPromise = WebsiteService.findWebsitesByUser(vm.userId);
            websitesPromise.success(function(websites) {
                vm.websites = websites;
            });

            var websiteEditPromise = WebsiteService.findWebsiteById(vm.websiteId);
            websiteEditPromise.success(function(websiteEdit) {
               vm.website = websiteEdit;
            });
        }
        init();

        vm.deleteWebsite = deleteWebsite;
        vm.updateWebsite = updateWebsite;

        function deleteWebsite() {
            var websiteDeletePromise = WebsiteService.deleteWebsite(vm.websiteId);
            websiteDeletePromise.success(function() {
                $location.url("/user/" + vm.userId + "/website");
            });
        }

        function updateWebsite(newSite) {
            var websiteUpdatePromise = WebsiteService.updateWebsite(vm.websiteId, newSite);
            websiteUpdatePromise.success(function() {
                $location.url("/user/" + vm.userId + "/website");
            });
        }
    }
})();