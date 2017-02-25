(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService() {
        var users = [
            {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder",  email: "alice@wonderland.com" },
            {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley",  email: "bob@marley.com" },
            {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia",  email: "charly@garcia.com" },
            {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi", email: "jose@annunzi.com" }
        ];
        var api = {
            "createUser"   : createUser,
            "findUserById" : findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };
        return api;

        function createUser(user) {
            if (findUserById(user._id) != null) {
                users.push({
                    "_id": user.id,
                    "username": user.username,
                    "password": user.password,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email
                });
                return user;
            }
            return null;

        }

        function findUserById(id) {
            for(var u in users) {
                var user = users[u];

                if (user._id === id) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function findUserByUsername(username) {
            for(var u in users) {
                var user = users[u];

                if (user.username === username) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function findUserByCredentials(username, password) {
            for(var u in users) {
                var user = users[u];

                if (user.username === username && user.password === password) {
                    return angular.copy(users[u]);
                }
            }
            return null;
        }

        function updateUser(userId, updatedUser) {
            for(var u in users) {
                var user = users[u];

                if (user._id === userId) {
                    user[u].firstName = updatedUser.firstName;
                    user[u].lastName = updatedUser.lastName;
                    user[u].email = updatedUser.email;
                    user[u].username = updatedUser.username;
                    user[u].password = updatedUser.password;

                    return angular.copy(user);
                }
            }
            return null;
        }

        function deleteUser(userId) {
            for (var u in users) {
                var user = users[u];

                if (user._id === userId) {
                    users.splice(u, 1);
                    return user;
                }
            }
            return null;
        }
    }
})();