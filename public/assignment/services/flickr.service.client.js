(function () {
    angular
        .module('WebAppMaker')
        .factory('FlickrService', flickrService);

    function flickrService($http) {

        var key = 'a13d1e03cfe4d36ba12b88dfb8530390';
        var secret = '3a6ed6f6d825b768';
        var urlBase = 'https://api.flickr.com/services/rest/?method=flickr.photos.search' +
            '&format=json&api_key=API_KEY&text=TEXT';

        return {
            'searchPhotos': searchPhotos
        };

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }

})();