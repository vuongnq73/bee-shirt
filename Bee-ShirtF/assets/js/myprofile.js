angular
  .module("profileApp", [])
  .controller("ProfileController", [
    "$scope",
    "$http",
    "$location",
    "$window",
    function ($scope, $http, $location, $window) {
      // Cấu hình URL và token
      const API_BASE_URL = "http://localhost:8080/admin";
      const token = sessionStorage.getItem("jwtToken");
      const userCode = sessionStorage.getItem("userCode");

      // Kiểm tra đăng nhập
      if (!token || !userCode) {
        $location.path("/login");
        return;
      }

      // Khởi tạo biến
      $scope.user = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        username: "",
        pass: "",
        address: "",
        avatarFile: null,
        status: [],
      };
      $scope.errorMessage = "";
      $scope.successMessage = "";
      $scope.isSubmitting = false;
      $scope.statuses = [
        { value: 0, name: "Hoạt Động" },
        { value: 1, name: "Ngưng Hoạt Động" },
      ];

      // Biến cho chức năng đổi mật khẩu
      $scope.passwordData = {
        oldPassword: "",
        pass: "",
        confirmPassword: "",
      };

      // Validate form thông tin người dùng
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

        $scope.errorMessage = "";
        return true;
      }

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
    
    $scope.isAdmin = function () {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/assets/account/login.html";
        return false;
      }
    
      const payload = JSON.parse(atob(token.split(".")[1]));
      const highestRole = getHighestRole(payload.scope);
    
      return highestRole === "ROLE_ADMIN";
    };
    

      // Gửi dữ liệu cập nhật thông tin người dùng
      function submitUpdate() {
        const formData = new FormData();
        formData.append("firstName", $scope.user.firstName);
        formData.append("lastName", $scope.user.lastName);
        formData.append("phone", $scope.user.phone);
        formData.append("email", $scope.user.email);
        formData.append("address", $scope.user.address);
        formData.append("status", $scope.user.status);

        // Nếu có ảnh avatar, thêm vào form data
        if ($scope.user.avatarFile) {
          formData.append("avatarFile", $scope.user.avatarFile);
        }

        // Gửi yêu cầu cập nhật
        $http
          .put(`${API_BASE_URL}/update/${userCode}`, formData, {
            transformRequest: angular.identity,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": undefined,
            },
          })
          .then(function (response) {
            console.log("Server response:", response);
            // Kiểm tra kết quả trả về từ API
            if (
              response.data &&
              response.data.code === 1000 &&
              response.data.result
            ) {
              // Nếu có kết quả và code là 1000, cập nhật thành công
              $scope.successMessage = "Cập nhật thành công!";
              $scope.goBack();
              $scope.errorMessage = "";
            } else {
              // Trường hợp có lỗi trong dữ liệu trả về
              $scope.errorMessage = "Cập nhật thất bại.";
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            // Xử lý lỗi từ server
            $scope.errorMessage = error.data
              ? error.data.message
              : "Cập nhật thất bại.";
            $scope.successMessage = "";
          })
          .finally(function () {
            $scope.isSubmitting = false;
          });
      }

      // Cập nhật thông tin người dùng
      $scope.updateAccount = function () {
        if (!validateForm() || $scope.isSubmitting) return;

        $scope.isSubmitting = true;
        submitUpdate();
      };

      // Gọi API lấy thông tin người dùng
      function loadUserProfile() {
        $http({
          method: "GET",
          url: `${API_BASE_URL}/account/${userCode}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.data && response.data.result) {
              $scope.user = response.data.result;
              console.log("User profile loaded:", $scope.user);
            } else {
              $scope.errorMessage = "Không thể lấy thông tin người dùng.";
            }
          })
          .catch((error) => {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
          });
      }

      $scope.showChangePasswordForm = false;

      // Toggle sự hiển thị form Change Password
      $scope.toggleChangePassword = function () {
        $scope.showChangePasswordForm = !$scope.showChangePasswordForm;
      };

      // Thay đổi mật khẩu
      $scope.updatePassword = function () {
        // Kiểm tra mật khẩu cũ và mật khẩu mới
        if (
          !$scope.passwordData.oldPassword ||
          !$scope.passwordData.pass ||
          !$scope.passwordData.confirmPassword
        ) {
          $scope.errorMessage = "Vui lòng nhập đầy đủ thông tin mật khẩu.";
          return;
        }

        // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
        if ($scope.passwordData.pass !== $scope.passwordData.confirmPassword) {
          $scope.errorMessage = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
          return;
        }

        // Tạo formData để gửi dữ liệu lên server
        var formData = new FormData();
        formData.append("oldPassword", $scope.passwordData.oldPassword);
        formData.append("pass", $scope.passwordData.pass);
        formData.append("confirmPassword", $scope.passwordData.confirmPassword);

        // Gửi yêu cầu cập nhật mật khẩu
        $http
          .put(`${API_BASE_URL}/update/${userCode}`, formData, {
            transformRequest: angular.identity,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": undefined, // Để trình duyệt tự động xác định content-type
            },
          })
          .then(function (response) {
            $scope.successMessage = "Mật khẩu đã được cập nhật thành công!";
            $scope.toggleChangePassword(); // Ẩn form
            $scope.goBack();
          })
          .catch(function (error) {
            $scope.errorMessage = "Mật khẩu cũ không chính xác.";
          });
      };

      // Quay lại trang trước
      $scope.goBack = function () {
        $window.history.back();
      };

      // Xử lý roles
      $scope.getRoles = function (roles) {
        if (Array.isArray(roles)) {
          return roles.map((role) => role.name).join(", ");
        }
        return "No roles assigned";
      };

      // Gọi API khi khởi tạo controller
      loadUserProfile();
    },
  ])
  .directive("fileInput", function () {
    return {
      restrict: "A",
      link: function (scope, element) {
        element.on("change", function (event) {
          const file = event.target.files[0];
          scope.$apply(() => {
            scope.user.avatarFile = file;
          });
        });
      },
    };
  });
