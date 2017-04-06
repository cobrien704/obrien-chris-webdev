(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);

    function UserService($http) {

        var api = {
            "createUser"   : createUser,
            "findUserById" : findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "register": register,
            "login": login,
            "logout": logout
        };
        return api;

        function createUser(newUser) {
            return $http.post("/api/user", newUser);
        }

        function findUserById(id) {
            return $http.get("/api/user/" + id);
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function updateUser(userId, updatedUser) {
            return $http.put("/api/user/" + userId, updatedUser);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/" + userId);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout(user) {
            return $http.post('/api/logout', user);
        }
    }
})();