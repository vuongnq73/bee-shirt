angular
  .module("staffApp", ["ngRoute"])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/staff/Profile", {
        templateUrl: "/staff/Profile.html",
        controller: "ProfileController",
      })
      .otherwise({
        redirectTo: "/login", // Redirect về trang đăng nhập nếu không khớp
      });
  })
  .controller("StaffController", [
    "$scope",
    "$http",
    "$location", // Thêm $location vào đây
    "$window",
    function ($scope, $http, $location, $window) {
      // Khởi tạo biến để kiểm soát hiển thị form tạo tài khoản
      $scope.showCreateAccountForm = false; // Biến này điều khiển hiển thị biểu mẫu

      // Dữ liệu
      $scope.staffList = [];
      $scope.filteredStaffList = []; // Danh sách nhân viên đã lọc
      $scope.errorMessage = ""; // Để lưu thông báo lỗi
      $scope.myProfile = {
        avatar: "",
        firstName: "",
        lastName: "",
        email: "",
      };
      $scope.successMessage = ""; // Để lưu thông báo thành công
      $scope.isSubmitting = false; // Biến để kiểm tra trạng thái submit
      $scope.user = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        username: "",
        pass: "",
        address: "",
        avatarFile: null, // File ảnh đại diện từ input
        role: [],
      };
      $scope.hasPermission = true;
      $scope.currentPage = 1;
      $scope.totalPages = 0;
      $scope.pageSize = 5; // Số lượng nhân viên trên mỗi trang

      $scope.availableRoles = ["ADMIN", "STAFF", "USER"]; // Danh sách role có sẵn

      //set role
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

      // Hàm kiểm tra quyền
      function checkPermission() {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) {
          alert("Bạn chưa đăng nhập!");
          window.location.href = "/assets/account/login.html";
          return false;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));

        // Cả 2 quyền đều có truy cập
        // const roles = payload.scope ? payload.scope.split(" ") : [];

        // if (!roles.includes("ROLE_STAFF") && !roles.includes("ROLE_ADMIN")) {
        //   alert("Bạn không có quyền truy cập vào trang này!");
        //   window.history.back();
        //   return false;
        // }

        const highestRole = getHighestRole(payload.scope);

        if (highestRole !== "ROLE_ADMIN") {
          alert("Bạn không có quyền truy cập vào trang này!");
          $window.history.back();
          return false;
        }
        return true;
      }

      if (!checkPermission()) return;

      // Hàm xem profile
      $scope.viewProfile = function () {
        const token = sessionStorage.getItem("jwtToken");

        if (!token || token.split(".").length !== 3) {
          console.log("Token không hợp lệ hoặc không tồn tại");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload && payload["user Code"]) {
          const userCode = payload["user Code"];
          sessionStorage.setItem("userCode", userCode);
          console.log("userCode đã được lưu vào sessionStorage:", userCode);
        } else {
          console.log("Không tìm thấy userCode trong payload");
        }

        $window.location.href = "/assets/staff/Profile.html";
      };

      $scope.getMyProfile = function () {
        //Lấy thông tin của tài khoản đang đăng nhập
        const token = sessionStorage.getItem("jwtToken");
        $http({
          method: "GET",
          url: `http://localhost:8080/admin/myProfile`, // Đảm bảo URL đúng
          headers: {
            Authorization: "Bearer " + token, // Kiểm tra xem token có hợp lệ không
          },
        })
          .then(function (response) {
            console.log("Response:", response); // Log toàn bộ response để kiểm tra

            if (response.data && response.data.result) {
              $scope.myProfile = response.data.result;
              console.log("My Profile:", $scope.myProfile); // Kiểm tra giá trị gán vào myProfile
            } else {
              $scope.errorMessage = "Không thể lấy thông tin người dùng.";
              console.log($scope.errorMessage);
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
          })
          .finally(function () {
            $scope.loading = false; // Tắt trạng thái loading sau khi nhận được phản hồi
          });
      };

      // Hàm lấy danh sách tài khoản
      $scope.getStaffs = function (page = 1) {
        const token = sessionStorage.getItem("jwtToken");

        $http({
          method: "GET",
          url: `http://localhost:8080/admin/staffs/${page}`,
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then(function (response) {
            if (Array.isArray(response.data.result)) {
              $scope.staffList = response.data.result.map((staff) => ({
                code: staff.code,
                fullName: `${staff.firstName} ${staff.lastName}`,
                username: staff.username,
                email: staff.email,
                phone: staff.phone,
                avatar: staff.avatar,
                address: staff.address,
                status: staff.status,
              }));

              $scope.filteredStaffList = $scope.staffList;
            } else {
              console.error(
                "Dữ liệu không phải là một mảng:",
                response.data.result
              );
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi lấy danh sách tài khoản:", error);
            $scope.errorMessage = "Không thể lấy danh sách tài khoản.";
          });
      };

      $scope.getTotalPages = function () {
        const token = sessionStorage.getItem("jwtToken");

        $http({
          method: "GET",
          url: "http://localhost:8080/admin/totalPageStaff",
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then(function (response) {
            $scope.totalPages = response.data.result; // Cập nhật tổng số trang
          })
          .catch(function (error) {
            console.error("Lỗi khi lấy tổng số trang:", error);
          });
      };

      $scope.goToPage = function (page) {
        if (page < 1 || page > $scope.totalPages) return;
        $scope.currentPage = page;
        $scope.getStaffs(page); // Gọi lại hàm lấy danh sách theo trang
      };

      $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
          $scope.goToPage($scope.currentPage + 1);
        }
      };

      $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
          $scope.goToPage($scope.currentPage - 1);
        }
      };

      function submitcreation() {
        const token = sessionStorage.getItem("jwtToken");

        const formData = new FormData(); // Tạo FormData để gửi file
        formData.append("code", $scope.user.code);
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
        // Gửi danh sách vai trò
        $scope.user.role.forEach((role) => {
          formData.append("role", role); // Gửi từng vai trò
        });

        // Gửi dữ liệu đến API
        $http
          .post("http://localhost:8080/admin/create", formData, {
            transformRequest: angular.identity,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": undefined,
            },
          })
          .then(function (response) {
            console.log("Response nhận được từ server:", response);
            $scope.successMessage =
              "Tạo thành công! Bạn có thể đăng nhập ngay."; // Thông báo thành công
            $scope.getStaffs($scope.currentPage);
            $scope.getTotalPages();
            $scope.errorMessage = ""; // Xóa thông báo lỗi (nếu có)
            resetForm(); // Reset form sau khi tạo tài khoản thành công
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
          })
          .finally(function () {
            $scope.isSubmitting = false; // Kích hoạt lại nút sau khi xử lý xong
          });
      }

      function fastRegister() {
        const formData = new FormData(); // Tạo FormData để gửi file
        formData.append("firstName", $scope.user.firstName);
        formData.append("lastName", $scope.user.lastName);
        formData.append("phone", $scope.user.phone);
        formData.append("email", $scope.user.email);
        formData.append("username", $scope.user.email);
        formData.append("pass", $scope.user.phone);
        formData.append("address", $scope.user.address);

  
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
            resetForm()
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

      // Hàm reset form
      // Hàm reset form
      function resetForm() {
        $scope.user = {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          username: "",
          pass: "",
          address: "",
          avatarFile: null,
          role: [],
        };

        // Xóa file input nếu có
        const fileInput = document.querySelector("input[type='file']");
        if (fileInput) {
          fileInput.value = null; // Reset trường file
        }
        $scope.errorMessage = ""
      }

      // Hàm xác thực dữ liệu
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
        if ($scope.user.pass.length < 5) {
          $scope.errorMessage = "Mật khẩu phải lớn hơn 5 ký tự.";
          return false;
        }

        $scope.errorMessage = "";
        return true;
      }
       // Hàm xác thực dữ liệu
       function validateModal() {
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
        $scope.errorMessage = "";
        return true;
      }
      
      $scope.cancelCreateAccount = function () {
        $scope.showCreateAccountForm = false; // Đặt lại trạng thái form về không hiển thị
        resetForm(); // Gọi hàm resetForm để làm sạch dữ liệu
      };

      $scope.createAccount = function () {
        // Kiểm tra điều kiện và trạng thái submit
        if (!validateForm() || $scope.isSubmitting) {
          return;
        }

        // Đặt trạng thái đang xử lý
        $scope.isSubmitting = true;

        // Gọi hàm xử lý create
        submitcreation();
      };

      $scope.register = function () {
        // Kiểm tra điều kiện
        if (!validateModal()) {
          return;
        }
  
        // Gọi hàm xử lý đăng ký
        fastRegister();
      };

      $scope.deleteAccount = function (code) {
        if (confirm("Are you sure you want to delete this account?")) {
          const token = sessionStorage.getItem("jwtToken");

          // Khởi tạo biến trạng thái để tắt nút khi đang xóa
          $scope.isDeleting = true;

          $http({
            method: "DELETE",
            url: `http://localhost:8080/admin/delete/${code}`, // URL API cho chức năng xóa
            headers: {
              Authorization: "Bearer " + token,
            },
          })
            .then(function (response) {
              $scope.successMessage = "Account deleted successfully!";
              $scope.errorMessage = ""; // Xóa thông báo lỗi (nếu có)
              $scope.getStaffs($scope.currentPage); // Cập nhật lại danh sách nhân viên sau khi xóa
              $scope.getTotalPages();
              $scope.isDeleting = false; // Kích hoạt lại nút sau khi hoàn tất

              // Tự động ẩn thông báo sau 3 giây
              setTimeout(function () {
                $scope.successMessage = "";
                $scope.$apply();
              }, 3000);
            })
            .catch(function (error) {
              console.error("Error deleting account:", error);
              $scope.errorMessage = "Failed to delete account.";
              $scope.successMessage = ""; // Xóa thông báo thành công (nếu có)
              $scope.isDeleting = false; // Kích hoạt lại nút sau khi gặp lỗi
            });
        }
      };

      $scope.goToUpdateProfile = function (userCode) {
        // Lưu thông tin người dùng vào sessionStorage để chuyển trang
        sessionStorage.setItem("userCode", userCode);

        // Sử dụng $location để điều hướng trong AngularJS
        window.location.href = "/assets/staff/Profile.html";
      };

      // Hàm tìm kiếm
      $scope.searchStaff = function () {
        if (!$scope.searchQuery) {
          $scope.filteredStaffList = $scope.staffList;
        } else {
          $scope.filteredStaffList = $scope.staffList.filter(function (staff) {
            return (
              staff.code
                .toLowerCase()
                .includes($scope.searchQuery.toLowerCase()) ||
              staff.username
                .toLowerCase()
                .includes($scope.searchQuery.toLowerCase()) ||
              staff.email
                .toLowerCase()
                .includes($scope.searchQuery.toLowerCase()) ||
              staff.phone.includes($scope.searchQuery) ||
              staff.address
                .toLowerCase()
                .includes($scope.searchQuery.toLowerCase())
            );
          });
        }
      };

      // Gọi các hàm khởi tạo
      $scope.getStaffs($scope.currentPage);
      $scope.getTotalPages();
      $scope.getMyProfile();
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
