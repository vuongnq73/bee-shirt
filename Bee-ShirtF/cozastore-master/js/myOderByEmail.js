angular.module('MyOderApp2', [])
    .controller('OrderController2', function ($scope, $http, $window) {

        // Gọi API lấy đơn hàng
        function fetchOrdersByEmail(email, tabIndex) {
            const url = `http://localhost:8080/myOderByEmail/list${tabIndex}/${email}`;
            $scope.loading = true;
            $scope.errorMessage = "";

            $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
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
            $window.location.href = `myOderTimeLineByEmail.html?codeBill=${codeBill}`;
        };

        // Chọn tab
        $scope.selectTab = function (tabIndex) {
            $scope.selectedTab = tabIndex;
            if ($scope.user && $scope.user.email) {
                fetchOrdersByEmail($scope.user.email, tabIndex); // Lấy dữ liệu cho tab đã chọn
            } else {
                $scope.errorMessage = "Vui lòng đăng nhập trước khi xem đơn hàng.";
            }
        };

        // Lấy email từ URL và tải profile
        function loadUserProfile() {
            const urlParams = new URLSearchParams(window.location.search); // Sử dụng URLSearchParams để lấy tham số từ URL
            const email = urlParams.get('email'); // Lấy giá trị email từ query string

            if (email) {
                $scope.user = { email: email }; // Gán email vào $scope.user
                $scope.selectTab(1); // Mặc định chọn tab đầu tiên khi email tồn tại
            } else {
                $scope.errorMessage = "Không tìm thấy email. Vui lòng thử lại.";
            }
        }

        // Gọi hàm khi tài liệu sẵn sàng
        angular.element(document).ready(() => {
            loadUserProfile();
        });
    });
