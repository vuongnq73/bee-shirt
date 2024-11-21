angular.module("staffApp", []).controller("StaffController", [
  "$scope",
  "$http",
  function ($scope, $http) {
    // Dữ liệu
    $scope.staffList = [];
    $scope.filteredStaffList = []; // Danh sách nhân viên đã lọc
    $scope.errorMessage = ""; // Để lưu thông báo lỗi
    $scope.successMessage = ""; // Để lưu thông báo thành công

    // Hàm kiểm tra quyền
    function checkPermission() {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Bạn chưa đăng nhập!"); // Thông báo nếu chưa có token
        window.location.href = "/assets/account/login.html";
        return false; // Không có quyền truy cập
      }

      // Giải mã token để lấy quyền
      const payload = JSON.parse(atob(token.split(".")[1]));
      const highestRole = getHighestRole(payload.scope);

      // Kiểm tra xem người dùng có phải là admin không
      if (highestRole !== "ROLE_ADMIN") {
        alert("Bạn không có quyền truy cập vào trang này!"); // Thông báo không đủ quyền
        window.location.href = "/assets/BanHang.html";
        return false; // Không có quyền truy cập
      }

      return true; // Có quyền truy cập
    }

    // Kiểm tra quyền truy cập khi khởi tạo controller
    if (!checkPermission()) return;

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

    // Hàm lấy danh sách tài khoản
    $scope.getStaffs = function () {
      const token = sessionStorage.getItem("jwtToken");

      $http({
        method: "GET",
        url: "http://localhost:8080/admin/staffs",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          if (Array.isArray(response.data.result)) {
            // Tạo danh sách nhân viên
            $scope.staffList = response.data.result.map((staff) => ({
              fullName: `${staff.firstName} ${staff.lastName}`,
              username: staff.username,
              email: staff.email,
              phone: staff.phone,
              avatar: staff.avatar,
              address: staff.address,
              status: staff.status,
              createAt: staff.createAt,
              updateAt: staff.updateAt,
              createBy: staff.createBy,
              updateBy: staff.updateBy,
            }));

            // Khởi tạo danh sách đã lọc
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

    // Hàm tìm kiếm
    $scope.searchStaff = function () {
      if (!$scope.searchQuery) {
        // Nếu không có từ khóa tìm kiếm, hiển thị toàn bộ danh sách
        $scope.filteredStaffList = $scope.staffList;
      } else {
        // Lọc danh sách nhân viên theo từ khóa tìm kiếm
        $scope.filteredStaffList = $scope.staffList.filter(function (staff) {
          return (
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
    $scope.getStaffs();
  },
]);
