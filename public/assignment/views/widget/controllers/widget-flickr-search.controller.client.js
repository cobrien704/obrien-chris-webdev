(function () {
    angular
        .module("WebAppMaker")
        .controller("FlickrImageSearchController", flickrImageSearchController);

    function flickrImageSearchController(FlickrService, WidgetService, $location, $routeParams) {
        var vm = this;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;

        function init() {
            vm.userId = $routeParams['uid'];
            vm.websiteId = $routeParams['wid'];
            vm.pageId = $routeParams['pid'];
            vm.widgetId = $routeParams['wgid'];
        }

        init();

        function searchPhotos(searchTerm) {
            FlickrService.searchPhotos(searchTerm).then(function (response) {
                var data = response.data.replace("jsonFlickrApi(", "");
                data = data.substring(0, data.length - 1);
                data = JSON.parse(data);
                vm.photos = data.photos.photo;
            }, function () {
                vm.error = 'Unable to load images. Please try again.';
            });
        }

        function selectPhoto(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            var errorFunction = function () {
                vm.error = 'Could not add photo to widget. Please try again.';
            };
            WidgetService.findWidgetById(vm.widgetId).then(function (response) {
                var widget = response.data;
                widget.url = url;
                WidgetService.updateWidget(vm.widgetId, widget).then(function () {
                    $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget/' + vm.widgetId);
                }, errorFunction);
            }, errorFunction);
        }
    }
})();