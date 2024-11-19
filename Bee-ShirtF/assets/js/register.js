angular
  .module("registerApp", [])
  .controller("registerController", function ($scope, $http) {
    $scope.user = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      username: "",
      pass: "",
      address: "",
      avatarFile: null, // File ảnh đại diện từ input
    };

    $scope.errorMessage = "";
    $scope.successMessage = ""; // Biến để lưu thông báo thành công

    // Hàm đăng ký
    $scope.register = function () {
      // Kiểm tra điều kiện
      if (!validateForm()) {
        return;
      }

      // Gọi hàm xử lý đăng ký
      submitRegistration();
    };

    // Hàm xử lý việc đăng ký
    function submitRegistration() {
      const formData = new FormData(); // Tạo FormData để gửi file
      formData.append("firstName", $scope.user.firstName);
      formData.append("lastName", $scope.user.lastName);
      formData.append("phone", $scope.user.phone);
      formData.append("email", $scope.user.email);
      formData.append("username", $scope.user.username);
      formData.append("pass", $scope.user.pass);
      formData.append("address", $scope.user.address);
      if ($scope.user.avatarFile) {
        formData.append("avatarFile", $scope.user.avatarFile); // Chỉ thêm nếu file không null
      }

      // Gửi dữ liệu đến API
      $http
        .post("http://localhost:8080/user/register", formData, {
          transformRequest: angular.identity,
          headers: { "Content-Type": undefined }, // Để tự động thiết lập kiểu content type
        })
        .then(function (response) {
          console.log("Response nhận được từ server:", response);
          $scope.successMessage =
            "Đăng ký thành công! Bạn có thể đăng nhập ngay."; // Thông báo thành công
          $scope.errorMessage = ""; // Xóa thông báo lỗi (nếu có)

          // Đợi 2 giây trước khi chuyển hướng đến trang đăng nhập
          setTimeout(() => {
            window.location.href = "/assets/account/login.html";
          }, 2000);
        })
        .catch(function (error) {
          console.log("Lỗi:", error);
          // Kiểm tra cấu trúc của đối tượng lỗi
          if (error.data && error.data.message) {
            $scope.errorMessage = error.data.message;
          } else {
            $scope.errorMessage = "Đăng ký thất bại.";
          }
          $scope.successMessage = ""; // Xóa thông báo thành công (nếu có)
        });
    }

    // Hàm xác thực dữ liệu
    function validateForm() {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!$scope.user.firstName || !$scope.user.lastName) {
        $scope.errorMessage = "Tên và họ không được để trống.";
        return false;
      }
      if (!$scope.user.phone.match(phoneRegex)) {
        $scope.errorMessage = "Số điện thoại không hợp lệ.";
        return false;
      }
      if (!$scope.user.email.match(emailRegex)) {
        $scope.errorMessage = "Email không hợp lệ.";
        return false;
      }
      if ($scope.user.username.length < 3) {
        $scope.errorMessage = "Tên đăng nhập phải lớn hơn 3 ký tự.";
        return false;
      }
      if ($scope.user.pass.length < 5) {
        $scope.errorMessage = "Mật khẩu phải lớn hơn 5 ký tự.";
        return false;
      }

      $scope.errorMessage = ""; // Xóa thông báo lỗi
      return true; // Tất cả các điều kiện hợp lệ
    }
  })

  // Directive để xử lý input file
  .directive("fileInput", function () {
    return {
      restrict: "A",
      link: function (scope, element) {
        element.on("change", function (event) {
          var file = event.target.files[0];
          scope.$apply(function () {
            scope.user.avatarFile = file; // Lưu file vào scope
          });
        });
      },
    };
  });
