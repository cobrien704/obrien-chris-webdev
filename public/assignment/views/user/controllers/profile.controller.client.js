(function() {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, $location, $rootScope, UserService) {
        var vm = this;
        vm.logout = logout;

        var userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function(user) {
                vm.user = user;
            });
        }
        init();

        function logout(user) {
            UserService
                .logout(user)
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url('/');
                });
        }
    }
})();