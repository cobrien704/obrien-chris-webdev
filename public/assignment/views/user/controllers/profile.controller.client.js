(function() {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            vm.user = UserService.findUserById(userId);
        }
        init();
    }
})();