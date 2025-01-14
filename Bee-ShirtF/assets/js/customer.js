angular.module("customerApp", []).controller("CustomerController", [
  "$scope",
  "$http",
  "$window",
  function ($scope, $http, $window) {
    // Khởi tạo biến để kiểm soát hiển thị form tạo tài khoản
    $scope.showCreateAccountForm = false; // Biến này điều khiển hiển thị biểu mẫu

    // Dữ liệu
    $scope.customerList = [];
    $scope.filteredCustomerList = []; // Danh sách nhân viên đã lọc
    $scope.myProfile = {
      avatar: "",
      firstName: "",
      lastName: "",
      email: "",
    };
    $scope.errorMessage = ""; // Để lưu thông báo lỗi
    $scope.successMessage = ""; // Để lưu thông báo thành công
    $scope.currentPage = 1;
    $scope.totalPages = 0;
    $scope.pageSize = 5; // Số lượng nhân viên trên mỗi trang

    $scope.availableRoles = ["ADMIN", "STAFF", "USER"]; // Danh sách role có sẵn

    // Hàm kiểm tra quyền
    function checkPermission() {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/assets/account/login.html";
        return false;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const highestRole = getHighestRole(payload.scope);

      if (highestRole !== "ROLE_ADMIN") {
        alert("Bạn không có quyền truy cập vào trang này!");
        window.location.href = "/assets/BanHang.html";
        return false;
      }

      return true;
    }

    if (!checkPermission()) return;

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

    // Hàm lấy danh sách tài khoản
    $scope.getClients = function (page = 1) {
      const token = sessionStorage.getItem("jwtToken");

      $http({
        method: "GET",
        url: `http://localhost:8080/admin/clients/${page}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          if (Array.isArray(response.data.result)) {
            $scope.customerList = response.data.result.map((client) => ({
              code: client.code,
              fullName: `${client.firstName} ${client.lastName}`,
              username: client.username,
              email: client.email,
              phone: client.phone,
              avatar: client.avatar,
              status: client.status,
            }));

            $scope.filteredCustomerList = $scope.customerList;
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
        url: "http://localhost:8080/admin/totalPageClient",
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
      $scope.getClients(page); // Gọi lại hàm lấy danh sách theo trang
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

    $scope.logout = function () {
      // Lấy token từ sessionStorage
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Không tìm thấy token, vui lòng đăng nhập lại.");
        window.location.href = "/assets/account/login.html";
        return;
      }

      // Tạo payload cho API logout
      const logoutRequest = {
        token: token, // Gửi token của người dùng hiện tại
      };

      // Gửi yêu cầu logout đến backend
      $http
        .post("http://localhost:8080/auth/logout", logoutRequest)
        .then(function (response) {
          // Xóa token khỏi sessionStorage
          sessionStorage.removeItem("jwtToken");

          // Chuyển hướng về trang đăng nhập
          alert("Đăng xuất thành công!");
          window.location.href = "/assets/account/login.html";
        })
        .catch(function (error) {
          // Xử lý lỗi khi không logout được
          console.error("Lỗi khi đăng xuất:", error);
          alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!");
        });
    };


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
            $scope.getCustomers(); // Cập nhật lại danh sách nhân viên sau khi xóa
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

    // Hàm tìm kiếm
    $scope.searchCustomer = function () {
      if (!$scope.searchQuery) {
        $scope.filteredCustomerList = $scope.customerList;
      } else {
        $scope.filteredCustomerList = $scope.customerList.filter(function (
          customer
        ) {
          return (
            customer.code
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            customer.username
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            customer.email
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            customer.phone.includes($scope.searchQuery) ||
            customer.address
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase())
          );
        });
      }
    };

    //Lấy thông tin của tài khoản đang đăng nhập
    $scope.getMyProfile = function () {
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
    // Hàm xem profile
    $scope.goToUpdateProfile = function (userCode) {
      // Lưu thông tin người dùng vào sessionStorage để chuyển trang
      sessionStorage.setItem("userCode", userCode);

      // Sử dụng $location để điều hướng trong AngularJS
      window.location.href = "/assets/staff/Profile.html";
    };

    // Gọi các hàm khởi tạo
    $scope.getClients($scope.currentPage);
    $scope.getTotalPages();
    $scope.getMyProfile();
  },
]);
