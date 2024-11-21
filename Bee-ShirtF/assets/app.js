angular.module("loginApp", ["ngRoute"]).config(function ($routeProvider) {
  $routeProvider
    .when("/admin/home", {
      templateUrl: "/assets//page/admin/home.html",
      controller: "AdminController",
    })
    .when("/staff/home", {
      templateUrl: "/assets//page/staff/home.html",
      controller: "StaffController",
    })
    .when("/user/home", {
      templateUrl: "/assets//page/user/home.html",
      controller: "UserController",
    })
    .when("/voucher/home", {
      templateUrl: "/assets//page/voucher/home.html",
      controller: "VoucherController",
    })
    .when("/login", {
      templateUrl: "/assets//page/auth/login.html",
      controller: "LoginController",
    })
    .otherwise({
      redirectTo: "/login",
    });
});
