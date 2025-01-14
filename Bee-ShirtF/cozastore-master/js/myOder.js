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

        // Khi tài liệu sẵn sàng, gọi hàm load profile
        angular.element(document).ready(() => {
            loadUserProfile();
        });
    });
