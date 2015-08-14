
/*!
*   BaranGroup System v0.0.13
*   Author: Mehran Arjmand & Elyas Ghasemi
*   Website: Baran Group <http://barang.ir>
*   License: Open source - GNU
!*/
var app = angular.module("Baran", []);
app.controller("LoginController", ["$scope", "$http", function(a, b) {
    a.Deactive = !1, a.showPassword = function(a) {
        $("#" + a).attr("type", "text")
    }, a.hidePassword = function(a) {
        $("#" + a).attr("type", "password")
    }, a.login = function() {
        a.Deactive = !0, b.post("/", a.user).success(function(b) {
            1 == b.auth ? (a.Deactive = !0, toastr.success("\u062e\u0648\u0634 \u0622\u0645\u062f\u06cc\u062f"), setTimeout(function() {
                window.location.assign("/")
            }, 1524)) : (a.Deactive = !1, toastr.error("\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0645\u0639\u062a\u0628\u0631 \u0646\u06cc\u0633\u062a.", "\u062e\u0637\u0627"))
        }).error(function() {
            a.Deactive = !1, toastr.error("\u062e\u0637\u0627 \u062f\u0631 \u0628\u0631\u0642\u0631\u0627\u0631\u06cc \u0627\u0631\u062a\u0628\u0627\u0637 \u0628\u0627 \u0633\u0631\u0648\u0631")
        })
    }, toastr.options = {
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