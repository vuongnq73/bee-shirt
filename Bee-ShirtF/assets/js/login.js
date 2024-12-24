angular
  .module("loginApp", ["ngRoute"]) // Thêm ngRoute vào module
  .config(function ($routeProvider) {
    $routeProvider
      .when("/staff/staff", {
        templateUrl: "staff/staff.html",
        controller: "StaffController",
      })
      .when("/cozastore-master/index", {
        templateUrl: "/cozastore-master/index.html",
        controller: "HomePageController",
      })
      .otherwise({
        redirectTo: "/login", // Redirect về trang đăng nhập nếu không khớp
      });
  })
  .controller("loginController", function ($scope, $http, $location, $window) {
    $scope.user = {
      username: "",
      password: "",
    };
    $scope.isSubmitting = false
    $scope.rememberMe = false;
    $scope.errorMessage = "";
    $scope.isForgotPasswordModalVisible = false; // Biến điều khiển hiển thị modal
    $scope.forgotPasswordError = "";
    $scope.email = "";
  
    // Hàm quên mật khẩu (hiển thị modal)
    $scope.showForgotPasswordModal = function () {
      console.log("Show Forgot Password Modal");
      $scope.isForgotPasswordModalVisible = true;
    };
  
    // Hàm đóng modal quên mật khẩu
    $scope.closeForgotPasswordModal = function () {
      console.log("Close Forgot Password Modal");
      $scope.isForgotPasswordModalVisible = false;
      $scope.forgotPasswordError = ""; // Reset lỗi khi đóng modal
    };
  
    // Gửi yêu cầu quên mật khẩu
    $scope.forgotPassword = function () {
      if ($scope.isSubmitting) {
        return;
      }

       // Đặt trạng thái đang xử lý
      $scope.isSubmitting = true;

      if (!$scope.email) {
        $scope.forgotPasswordError = "Vui lòng nhập email!";
        return;
      }
      const email = $scope.email;
      console.log(email);
      $http
        .post("http://localhost:8080/auth/forgot-password?email=" + encodeURIComponent(email))
        .then(function (response) {
          alert("Email đã được gửi đến " + email + " để reset mật khẩu.");
          $scope.closeForgotPasswordModal(); // Đóng modal sau khi gửi email
        })
        .catch(function (error) {
          console.log("Lỗi khi gửi email reset mật khẩu:", error);
          if (error.data && error.data.message) {
            $scope.forgotPasswordError = error.data.message;
          } else {
            $scope.forgotPasswordError = "Không thể gửi email reset mật khẩu.";
          }
        })
        .finally(function () {
          $scope.email = "";
          $scope.isSubmitting = false; // Kích hoạt lại nút sau khi xử lý xong
        });
    };
  
    // Hàm đăng nhập
    $scope.login = function () {
      $http
        .post("http://localhost:8080/auth/login", $scope.user)
        .then(function (response) {
          console.log("Response nhận được từ server:", response);
          const token = response.data.result.token;
          if (!token || token.split(".").length !== 3) {
            $scope.errorMessage = "Token không hợp lệ.";
            return;
          }
  
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload && payload["user Code"]) {
            const userCode = payload["user Code"];
            sessionStorage.setItem("userCode", userCode);
          }
  
          if ($scope.rememberMe) {
            localStorage.setItem("jwtToken", token);
          } else {
            sessionStorage.setItem("jwtToken", token);
          }
  
          const highestRole = getHighestRole(payload.scope);
          redirectToPage(highestRole);
        })
        .catch(function (error) {
          console.log("Lỗi:", error);
          if (error.data && error.data.message) {
            $scope.errorMessage = error.data.message;
          } else {
            $scope.errorMessage = "Đăng nhập thất bại.";
          }
        });
    };
  
    // Hàm lấy quyền cao nhất
    function getHighestRole(scopes) {
      const roles = scopes ? scopes.split(" ") : [];
      const rolePriority = {
        ROLE_ADMIN: 1,
        ROLE_STAFF: 2,
        ROLE_USER: 3,
      };
  
      const validRoles = roles.filter((role) => rolePriority[role]);
      validRoles.sort((a, b) => rolePriority[a] - rolePriority[b]);
  
      return validRoles[0] || null;
    }
  
    // Điều hướng đến trang tương ứng với quyền cao nhất
    function redirectToPage(highestRole) {
      if (highestRole === "ROLE_ADMIN" || highestRole === "ROLE_STAFF") {
        window.location.href = "/assets/BanHang.html"; // Trang chung cho STAFF và ADMIN
      } else {
        window.location.href = "/cozastore-master/index.html";
      }
    }
  });
  
  
