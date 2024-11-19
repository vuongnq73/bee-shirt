angular
  .module("profileApp", [])
  .controller("ProfileController", [
    "$scope",
    "$http",
    "$location",
    "$window",
    function ($scope, $http, $location, $window) {
      // Lấy userCode từ sessionStorage
      const userCode = sessionStorage.getItem("userCode");

      const token = sessionStorage.getItem("jwtToken");

      // Kiểm tra nếu không có userCode, chuyển về trang đăng nhập
      if (!userCode) {
        $location.path("/login");
        return;
      }

      // Khai báo biến để lưu thông tin người dùng
      $scope.user = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        username: "",
        pass: "",
        address: "",
        avatarFile: null, // File ảnh đại diện từ input
        status: [],
      };
      $scope.errorMessage = ""; // Để lưu thông báo lỗi
      $scope.successMessage = ""; // Để lưu thông báo thành công
      $scope.isSubmitting = false; // Biến để kiểm tra trạng thái submit

      if (!token) {
        $location.path("/login");
        return;
      }

      // Hàm giải mã token
      // function decodeToken(token) {
      //   const base64Url = token.split(".")[1];
      //   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      //   const jsonPayload = decodeURIComponent(
      //     atob(base64)
      //       .split("")
      //       .map(function (c) {
      //         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      //       })
      //       .join("")
      //   );
      //   return JSON.parse(jsonPayload);
      // }

      // // Hàm xử lý khi nhấn View Profile
      // $scope.viewProfile = function () {
      //   token = sessionStorage.getItem("jwtToken");

      //   if (token) {
      //     const decodedToken = decodeToken(token);
      //     userCode = decodedToken["user Code"]; // Truy cập vào 'user Code' trong payload

      //     if (userCode) {
      //       // Lưu userCode vào sessionStorage
      //       sessionStorage.setItem("userCode", userCode);
      //       console.log("UserCode đã được lưu vào sessionStorage: ", userCode);
      //     } else {
      //       console.log("Không tìm thấy userCode trong token.");
      //     }
      //   } else {
      //     console.log("Token không tồn tại trong sessionStorage.");
      //   }

      //   // Chuyển hướng đến trang Profile của người dùng
      //   $location.path("/my-profile");
      // };

      // // Gọi API để lấy thông tin người dùng
      // $scope.getUserInfo = function () {
      //   userCode = sessionStorage.getItem("userCode");

      //   if (!userCode) {
      //     $location.path("/login");
      //     return;
      //   }

      //   $http({
      //     method: "GET",
      //     url: `http://localhost:8080/admin/account/${userCode}`, // Đảm bảo đúng API ở đây
      //     headers: {
      //       Authorization: "Bearer " + token,
      //     },
      //   })
      //     .then(function (response) {
      //       if (response.data && response.data.result) {
      //         $scope.user = response.data.result;
      //       } else {
      //         $scope.errorMessage = "Không thể lấy thông tin người dùng.";
      //       }
      //     })
      //     .catch(function (error) {
      //       $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
      //     })
      //     .finally(function () {
      //       $scope.loading = false;
      //     });
      // };

      // // Gọi hàm getUserInfo để tải dữ liệu người dùng khi vào trang My Profile
      // $scope.getUserInfo();

      function validateForm() {
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!$scope.user.firstName || !$scope.user.lastName) {
          $scope.errorMessage = "Tên và họ không được để trống.";
          return false;
        }
        if (!$scope.user.phone || !$scope.user.phone.match(phoneRegex)) {
          $scope.errorMessage = "Số điện thoại không hợp lệ.";
          return false;
        }
        if (!$scope.user.email || !$scope.user.email.match(emailRegex)) {
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
      function submitupdation() {
        const token = sessionStorage.getItem("jwtToken");

        const formData = new FormData(); // Tạo FormData để gửi file
        formData.append("firstName", $scope.user.firstName);
        formData.append("lastName", $scope.user.lastName);
        formData.append("phone", $scope.user.phone);
        formData.append("email", $scope.user.email);
        formData.append("address", $scope.user.address);
        formData.append("status", $scope.user.status);
        if ($scope.user.avatarFile) {
          formData.append("avatarFile", $scope.user.avatarFile); // Chỉ thêm nếu file không null
        }

        // Gửi dữ liệu đến API
        $http
          .put(`http://localhost:8080/admin/update/${userCode}`, formData, {
            transformRequest: angular.identity,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": undefined,
            },
          })
          .then(function (response) {
            console.log("Response nhận được từ server:", response);
            $scope.successMessage = "Sửa thành công!"; // Thông báo thành công
            $window.history.back(); // Quay lại trang trước
            $scope.errorMessage = ""; // Xóa thông báo lỗi (nếu có)
          })
          .catch(function (error) {
            console.log("Lỗi:", error);
            // Kiểm tra cấu trúc của đối tượng lỗi
            if (error.data && error.data.message) {
              $scope.errorMessage = error.data.message;
            } else {
              $scope.errorMessage = "Sửa thất bại.";
            }
            $scope.successMessage = ""; // Xóa thông báo thành công (nếu có)
          })
          .finally(function () {
            $scope.isSubmitting = false; // Kích hoạt lại nút sau khi xử lý xong
          });
      }

      $scope.updateAccount = function () {
        // Kiểm tra điều kiện và trạng thái submit
        if (!validateForm() || $scope.isSubmitting) {
          return;
        }

        // Đặt trạng thái đang xử lý
        $scope.isSubmitting = true;

        // Gọi hàm xử lý create
        submitupdation();
      };

      // Gọi API để lấy thông tin người dùng
      $http({
        method: "GET",
        url: `http://localhost:8080/admin/account/${userCode}`, // Đảm bảo đúng API ở đây
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          // Kiểm tra xem API trả về dữ liệu không
          if (response.data && response.data.result) {
            $scope.user = response.data.result; // Gán dữ liệu người dùng vào scope
            console.log("Status after data load: ", $scope.user.status);
          } else {
            $scope.errorMessage = "Không thể lấy thông tin người dùng.";
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
        })
        .finally(function () {
          $scope.loading = false; // Tắt trạng thái loading sau khi nhận được phản hồi
        });

      //Quay về trang trước
      $scope.goBack = function () {
        $window.history.back(); // Quay lại trang trước
      };
      $scope.statuses = [
        { value: 0, name: "Active" },
        { value: 1, name: "Inactive" },
      ];

      // Hàm để xử lý dữ liệu roles
      $scope.getRoles = function (roles) {
        if (Array.isArray(roles)) {
          // Nếu roles là mảng, tạo một chuỗi từ tên các vai trò
          return roles.map((role) => role.name).join(", "); // Lấy tên của mỗi vai trò và nối lại thành chuỗi
        } else {
          return "No roles assigned"; // Nếu không có vai trò nào
        }
      };
    },
  ])
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
