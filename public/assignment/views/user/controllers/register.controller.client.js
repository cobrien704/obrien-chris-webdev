(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            var newUser = UserService.create(user);

            if (newUser == null) {
                vm.error("User already exists.");
            }
            else {
                $location.url("/profile/", newUser._id);
            }
        }
    }
})();