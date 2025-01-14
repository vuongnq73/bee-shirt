angular.module('MyOderApp', [])
    .controller('OrderController', function ($scope, $http, $window) {
        const API_BASE_URL = "http://localhost:8080/admin";
        const token = sessionStorage.getItem("jwtToken");
        const userCode = sessionStorage.getItem("userCode");

        $scope.orders = []; // Danh sách đơn hàng hiển thị
        $scope.loading = false; // Trạng thái loading
        $scope.selectedTab = 1; // Tab mặc định
        $scope.errorMessage = ""; // Lưu thông báo lỗi nếu có

        // Kiểm tra token
        if (!token) {
            alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại nhé.");
            window.location.href = "http://127.0.0.1:5500/assets/account/login.html#!/login";
            return;
        }

        // Hàm load thông tin người dùng
        function loadUserProfile() {
            $http({
                method: "GET",
                url: `${API_BASE_URL}/account/${userCode}`,
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    if (response.data && response.data.result) {
                        $scope.user = response.data.result;
                        // Gọi API lấy đơn hàng cho tab mặc định (tab 1)
                        fetchOrdersByCustomerId($scope.user.id, $scope.selectedTab);
                    } else {
                        $scope.errorMessage = "Không thể lấy thông tin người dùng.";
                    }
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                    $scope.errorMessage = "Lỗi khi lấy thông tin người dùng.";
                });
        }

        // Gọi API lấy đơn hàng
        function fetchOrdersByCustomerId(customerId, tabIndex) {
            const url = `http://localhost:8080/myOder/list${tabIndex}/${customerId}`;
            $scope.loading = true;
            $scope.errorMessage = "";

            $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((response) => {
                    $scope.loading = false;
                    if (response.data && response.data.length) {
                        displayOrders(response.data);
                    } else {
                        $scope.errorMessage = "Không có đơn hàng nào.";
                        $scope.orders = [];
                    }
                })
                .catch((error) => {
                    $scope.loading = false;
                    console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
                    $scope.errorMessage = "Không thể tải dữ liệu. Vui lòng thử lại.";
                });
        }

        // Hàm hiển thị đơn hàng lên bảng
        function displayOrders(orders) {
            $scope.orders = orders.map((order, index) => {
                const orderStatus =
                    order.statusBill === 1 ? 'Đang xử lý' :
                        order.statusBill === 2 ? 'Đang Đóng Gói' :
                            order.statusBill === 3 ? 'Chờ Giao Hàng' :
                                order.statusBill === 4 ? 'Đang Giao Hàng' :
                                    order.statusBill === 5 ? 'Hoàn Tất' :
                                        order.statusBill === 6 ? 'Hoàn Tất' :
                                            order.statusBill === 7 ? 'Đã hủy' : 'Khác';
                return {
                    index: index + 1,
                    codeBill: order.codeBill,
                    createDate: order.createDate,
                    totalMoney: order.totalMoney.toLocaleString(),
                    orderStatus: orderStatus,
                    statusClass: order.statusBill === 1 ? 'text-warning' :
                        order.statusBill === 2 ? 'text-success' :
                            order.statusBill === 3 ? 'text-success' :
                                order.statusBill === 4 ? 'text-success' :
                                    order.statusBill === 5 ? 'text-success' :
                                    order.statusBill === 6 ? 'text-success' : 
                                        order.statusBill === 7 ? 'text-danger' : ''
                };
            });
        }

        // Chuyển hướng đến trang chi tiết đơn hàng
        $scope.goToOrderDetails = function (codeBill) {
            $window.location.href = `myOderTimeLine.html?codeBill=${codeBill}`;
        };

        // Chọn tab
        $scope.selectTab = function (tabIndex) {
            $scope.selectedTab = tabIndex;
            fetchOrdersByCustomerId($scope.user.id, tabIndex); // Lấy dữ liệu cho tab đã chọn
        };

    $scope.myProfile = null;
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
  
      $scope.logout = function () {
        $scope.myProfile = null;
        window.location.href = "/assets/account/login.html";
      };
  
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
        const token = sessionStorage.getItem("jwtToken");
  
        if (!token) {
          $scope.errorMessage = "Bạn cần đăng nhập trước.";
          $scope.loading = false;
          return;
        }
  
        $http({
          method: "GET",
          url: "http://localhost:8080/admin/myProfile",
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then(function (response) {
            if (response.data && response.data.result) {
              $scope.myProfile = response.data.result;
            } else {
              $scope.errorMessage = "Không thể lấy thông tin người dùng.";
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
          })
          .finally(function () {
            $scope.loading = false;
          });
      };
  
      $scope.goBack = function () {
  $window.history.back();
      };

      $scope.getMyProfile();
      
        // Khi tài liệu sẵn sàng, gọi hàm load profile
        angular.element(document).ready(() => {
            loadUserProfile();

        });
    });
