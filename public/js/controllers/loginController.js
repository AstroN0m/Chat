Chat.controller('LoginController', function ($scope, $http) {
    $scope.userData = {};

    function submitForm(url) {
        return function () {
            $http({
                method: 'POST',
                url: url,
                data: $.param($scope.userData),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function (data) {
                    $scope.message = 'Authorization is completed';
                    window.location.href = "/chat";
                }).
                error(function (data) {
                    console.log(data);
                    $scope.message = data;
                });
        }
    }

    $scope.login = submitForm('login');
    $scope.signup = submitForm('signup');

    $scope.logout = function () {
        $http({
            method: 'POST',
            url: 'logout'
        })
        .success(function () {
            window.location.href = "/";
        }).
        error(function () {

        });
    }
});