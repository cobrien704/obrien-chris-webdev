(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController);

        function LoginController($location, UserService) {
            var vm = this;
            vm.login = login;

            function login(user) {
                user = UserService.findUserByCredentials(user.username, user.password);
                if(user) {
                    $location.url("/user/" + user._id);
                } else {
                    vm.alert = "Unable to login";
                }
            }
        }
})();