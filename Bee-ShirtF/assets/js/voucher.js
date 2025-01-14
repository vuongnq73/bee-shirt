const app = angular.module("voucherApp", []);

app.controller("VoucherController", function ($scope, $http) {
    const apiUrl = "http://localhost:8080/voucher";

    $scope.vouchers = [];
    $scope.voucher = {};
    $scope.isEditing = false;
    $scope.successMessage = "";
    $scope.errorMessage = "";
    const token = sessionStorage.getItem("jwtToken");

    // Load all vouchers
    $scope.loadVouchers = function () {
        $http.get(`${apiUrl}/all`)
            .then(function (response) {
                $scope.vouchers = response.data.content;
            })
            .catch(function (error) {
                $scope.errorMessage = "Không thể tải danh sách voucher.";
            });
    };

    // Add or Update Voucher
    $scope.saveVoucher = function () {
        const url = $scope.isEditing ? `${apiUrl}/update/${$scope.voucher.id}` : `${apiUrl}/add`;
        $http.post(url, $scope.voucher)
            .then(function () {
                $scope.successMessage = $scope.isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!";
                $scope.resetForm();
                $scope.loadVouchers();
            })
            .catch(function () {
                $scope.errorMessage = "Lỗi khi lưu voucher.";
            });
    };

    // Delete Voucher
    $scope.deleteVoucher = function (id) {
        if (confirm("Bạn có chắc chắn muốn xóa?")) {
            $http.delete(`${apiUrl}/delete/${id}`)
                .then(function () {
                    $scope.successMessage = "Xóa thành công!";
                    $scope.loadVouchers();
                })
                .catch(function () {
                    $scope.errorMessage = "Lỗi khi xóa voucher.";
                });
        }
    };

    // Edit Voucher
    $scope.editVoucher = function (voucher) {
        $scope.voucher = angular.copy(voucher);
        $scope.isEditing = true;
    };

    // View Voucher
    $scope.viewVoucher = function (id) {
        $http.get(`${apiUrl}/detail/${id}`)
            .then(function (response) {
                alert(`Chi tiết Voucher:\n${JSON.stringify(response.data)}`);
            })
            .catch(function () {
                $scope.errorMessage = "Không thể tải chi tiết voucher.";
            });
    };

    // Reset Form
    $scope.resetForm = function () {
        $scope.voucher = {};
        $scope.isEditing = false;
        $scope.successMessage = "";
        $scope.errorMessage = "";
    };

    // Initialize
    $scope.loadVouchers();
});
