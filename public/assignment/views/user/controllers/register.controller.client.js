(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            var promise = UserService.createUser(user);
            promise.success(function (user) {
                if (user) $location.url('/user/' + user._id);
            }).error(function (error) {
                vm.error("User already exists.");
            });
        }
    }
})();