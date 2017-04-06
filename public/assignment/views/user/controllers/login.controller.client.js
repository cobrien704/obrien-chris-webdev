(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

        function LoginController($location, $rootScope, UserService) {
            var vm = this;
            vm.login = login;

            function login(user) {
                UserService
                    .login(user)
                    .then(function (response) {
                        var user = response.data;

                        if (user) {
                            $rootScope.currentUser = user;
                            $location.url('/user/' + user._id);
                        }
                        else {
                            vm.error = 'User not found';
                        }
                });
            }
        }
})();