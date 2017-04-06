(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            UserService
                .createUser(user)
                .then(function (response) {
                    var user = response.data;

                    if (user) {
                        $rootScope.currentUser = user;
                        $location.url('/user/' + user._id);
                    }
                    else {
                        vm.error("User already exists.");
                    }

            });
        }
    }
})();