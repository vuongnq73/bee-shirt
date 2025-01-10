var app = angular.module('SizeApp', []);

app.service('shirtDetailService', ['$http', function($http) {
    const baseUrl = 'http://localhost:8080/api/sizes';

    // Lấy danh sách kích thước với phân trang
    this.getSizes = function(page) {
        return $http.get(`${baseUrl}/list?page=${page}`);
    };
    this.getColors = function(page) {
        return $http.get(`${baseUrl}/list?page=${page}`);
    };

    // Thêm kích thước
    this.addSize = function(size) {
        return $http.post(`${baseUrl}/add`, size);
    };

    // Sửa kích thước
    this.updateSize = function(codeSize, updatedSize) {
        return $http.put(`${baseUrl}/update/${codeSize}`, updatedSize);
    };

    // Xóa kích thước
    this.deleteSize = function(codeSize) {
        return $http.put(`${baseUrl}/delete/${codeSize}`);
    };

    // Xem chi tiết kích thước
    this.getSizeDetail = function(codeSize) {
        return $http.get(`${baseUrl}/detail/${codeSize}`);
    };
}]);

app.controller('sizeController', ['$scope', 'shirtDetailService', function($scope, shirtDetailService) {
    $scope.sizes = [];
    $scope.currentPage = 0;  // Khởi tạo trang hiện tại
    $scope.totalPages = 0;   // Số trang tổng cộng
    $scope.pages = [];       // Mảng chứa số trang

    // Lấy danh sách kích thước và phân trang
    $scope.getSizes = function(page) {
        shirtDetailService.getSizes(page).then(function(response) {
            $scope.sizes = response.data.content;  // Dữ liệu trong trang
            $scope.totalPages = response.data.totalPages;  // Số trang tổng cộng
            $scope.pages = Array.from({ length: $scope.totalPages }, (_, i) => i);  // Tạo mảng trang
        }, function(error) {
            console.error('Error fetching sizes:', error);
        });
    };

    // Điều hướng giữa các trang
    $scope.goToPage = function(page) {
        $scope.currentPage = page;
        $scope.getSizes(page);
    };

    // Thêm kích thước
    $scope.openAddSizeModal = function() {
        // Hiển thị modal thêm kích thước (sử dụng $scope.size để lưu dữ liệu)
    };

    // Sửa kích thước
    $scope.openEditSizeModal = function(size) {
        // Hiển thị modal sửa kích thước (sử dụng $scope.size để lưu dữ liệu)
        $scope.selectedSize = angular.copy(size);
    };

    // Lưu thông tin sửa kích thước
    $scope.updateSize = function() {
        shirtDetailService.updateSize($scope.selectedSize.codeSize, $scope.selectedSize).then(function(response) {
            $scope.getSizes($scope.currentPage); // Tải lại danh sách sau khi cập nhật
        }, function(error) {
            console.error('Error updating size:', error);
        });
    };

    // Xóa kích thước
    $scope.deleteSize = function(codeSize) {
        shirtDetailService.deleteSize(codeSize).then(function(response) {
            $scope.getSizes($scope.currentPage); // Tải lại danh sách sau khi xóa
        }, function(error) {
            console.error('Error deleting size:', error);
        });
    };

    // Xem chi tiết kích thước
    $scope.viewSizeDetail = function(codeSize) {
        shirtDetailService.getSizeDetail(codeSize).then(function(response) {
            $scope.selectedSizeDetail = response.data;  // Lưu chi tiết kích thước
            // Hiển thị modal chi tiết kích thước
        }, function(error) {
            console.error('Error fetching size detail:', error);
        });
    };

    // Khởi tạo trang đầu tiên
    $scope.getSizes($scope.currentPage);
}]);
