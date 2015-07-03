/*!
*   BaranGroup System v0.0.13
*   Author: Mehran Arjmand & Elyas Ghasemi
*   Website: Baran Group <http://barang.ir>
*   License: Open source - GNU
!*/

var app = angular.module("Baran", []);
app.controller("RegisterController", ["$scope", "$http", function($scope, $http) {

    $scope.majorsList = [{"name": "نرم افزار", "group": "کامپیوتر"}, {"name": "سخت افزار", "group": "کامپیوتر"}, {"name": "آی تی", "group": "کامپیوتر"}, {"name": "کاردانی", "group": "کامپیوتر"}, {"name": "قدرت", "group": "برق"}, {"name": "الکترونیک", "group": "برق"}, {"name": "کنترل", "group": "برق"}, {"name": "مخابرات", "group": "برق"}, {"name": "مهندسی پزشکی", "group": "مهندسی"}, {"name": "عمران", "group": "مهندسی"}, {"name": "مکانیک", "group": "مهندسی"}, {"name": "صنایع", "group": "مهندسی"}, {"name": "مواد", "group": "مهندسی"}, {"name": "نقشه برداری", "group": ""}, {"name": "شیمی", "group": ""}, {"name": "نقاشی", "group": ""}, {"name": "گرافیک", "group": ""}, {"name": "عکاسی", "group": ""}, {"name": "ادبیات فارسی", "group": ""}, {"name": "الهیات", "group": ""}, {"name": "حقوق", "group": ""}, {"name": "حسابداری", "group": ""}, {"name": "دندانپزشکی", "group": ""}, {"name": "فن آوری اطلاعات سلامت", "group": ""}];
    $scope.entryYear = [];

    for (var i = 1380; i <= 1394; i++) {
      $scope.entryYear.push(i);
    };


    $scope.Deactive = !1, $scope.showPassword = function(elem) {
        $("#" + elem).attr("type", "text")
    }, $scope.hidePassword = function(elem) {
        $("#" + elem).attr("type", "password")
    }, $scope.register = function() {
        $scope.Deactive = !0, $http.post("/register", $scope.user).success(function(data) {
            1 == data.auth ? ($scope.Deactive = !0, toastr.success("\u062e\u0648\u0634 \u0622\u0645\u062f\u06cc\u062f"), setTimeout(function() {
                window.location.assign("/")
            }, 1524)) : ($scope.Deactive = !1, toastr.error("ثبت نام با موفقیت انجام شد."))
        }).error(function() {
            $scope.Deactive = !1, toastr.error("لطفا دوباره تلاش کنید.")
        })
    },
    $scope.validateMobile = function (){
        if (!$scope.registerForm.mobile.$error.pattern) {  
            $scope.Searching = !0;
            $scope.registerForm.mobile.$setValidity('unique',false);
            // todo get user phone
            $http.post("/exists",{mobile:$scope.user.mobile})
            .success(function (data){
                    $scope.Searching = !1;
                if (data.exists) {  
                    toastr.error("این شماره تماس قبلا عضو شده است.")
                }else{
                    $scope.registerForm.mobile.$setValidity('unique',true);
                };
            })
            .error(function() {
                $scope.Searching = !1;
                toastr.error("خطا در برقرار ارتباط با سرور");
            });;
        };
    },
    $scope.getMajorValue = function(major) {
      return major.group ? major.group + '-' + major.name : major.name;
    }
    ,toastr.options = {
        closeButton: !1,
        debug: !1,
        positionClass: "toast-bottom-left",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    }
}]);