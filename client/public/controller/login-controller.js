

var app = angular.module('Baran', []);
app.controller('LoginController',['$scope','$http', function($scope, $http) {

	$scope.Deactive = false;

    $scope.showPassword = function (id) {
        $("#"+id).attr("type","text");
    }

    $scope.hidePassword = function (id) {
        $("#"+id).attr("type","password");
    }

    $scope.login = function () {
      $scope.Deactive = true;

      $http.post('/', $scope.user).
      success(function(data) {
         if (data.auth == true) {
            $scope.Deactive = true;
            toastr.success('خوش آمدید');
            setTimeout(function () {
                window.location.assign("/");
            }, 1524);
        }else{
            $scope.Deactive = false;
            toastr.error('اطلاعات معتبر نیست.', 'خطا');
        }
    }).
      error(function(data, status, headers, config) {
        $scope.Deactive = false;
        toastr.error('خطا در برقراری ارتباط با سرور');
    });
  };


  toastr.options = {
    "closeButton": false,
    "debug": false,
    "positionClass": "toast-bottom-left",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

}]);
