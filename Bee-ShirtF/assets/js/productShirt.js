var app = angular.module('beeShirtApp', []);

app.service('shirtService', ['$http', function($http) {
    const baseUrl = 'http://localhost:8080/shirts';

    this.getShirts = function() {
        return $http.get(baseUrl + '/api/hienthi');
    };

    this.addShirt = function(shirt) {
        return $http.post(baseUrl + '/add', shirt);
    };

    this.updateShirt = function(codeshirt, shirt) {
        return $http.put(baseUrl + '/update/' + codeshirt, shirt);
    };

    this.deleteShirt = function(codeshirt) {
        return $http.delete(baseUrl + '/delete/' + codeshirt);
    };

    this.getShirtDetail = function(codeshirt) {
        return $http.get(baseUrl + '/detail/' + codeshirt);
    };

    this.getBrands = function() {
        return $http.get(baseUrl + '/api/brands');
    };

    this.getCategories = function() {
        return $http.get(baseUrl + '/api/categories');
    };
}]);

app.controller('ShirtController', ['$scope', 'shirtService', function($scope, shirtService) {
    $scope.shirts = [];
    $scope.brands = [];
    $scope.categories = [];
    $scope.newShirt = {};
    $scope.editingShirt = null; // Để lưu thông tin áo thun đang được chỉnh sửa
    $scope.selectedShirtDetail = null; // Để lưu thông tin áo thun đang xem chi tiết

    // Phân trang
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    $scope.totalPages = function() {
        return Math.ceil($scope.shirts.length / $scope.itemsPerPage);
    };

    $scope.getShirtsForCurrentPage = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const endIndex = startIndex + $scope.itemsPerPage;
        return $scope.shirts.slice(startIndex, endIndex);
    };

    $scope.getShirts = function() {
        shirtService.getShirts().then(function(response) {
            $scope.shirts = response.data;
            $scope.currentPage = 1; // Reset to page 1
        });
    };

    $scope.getBrands = function() {
        shirtService.getBrands().then(function(response) {
            $scope.brands = response.data;
        });
    };

    $scope.getCategories = function() {
        shirtService.getCategories().then(function(response) {
            $scope.categories = response.data;
        });
    };

    $scope.addShirt = function() {
        shirtService.addShirt($scope.newShirt).then(function() {
            $scope.getShirts();
            $scope.newShirt = {};
        });
    };

    $scope.deleteShirt = function(codeshirt) {
        if (confirm('Bạn có chắc chắn muốn xóa áo này không?')) {
            shirtService.deleteShirt(codeshirt).then(function() {
                $scope.getShirts();
            });
        }
    };

    // Chỉnh sửa áo thun
    $scope.editShirt = function(shirt) {
        // Sao chép đối tượng shirt để chỉnh sửa
        $scope.editingShirt = angular.copy(shirt);

        // Chuyển dữ liệu cho các dropdown (brand và category) để hiển thị đúng thông tin
        $scope.editingShirt.brandId = $scope.editingShirt.brand.id;
        $scope.editingShirt.categoryId = $scope.editingShirt.category.id;

        // Đảm bảo trạng thái đúng
        $scope.editingShirt.statusshirt = $scope.editingShirt.statusshirt;  // Trạng thái áo
        $scope.editingShirt.deleted = $scope.editingShirt.deleted;  // Trạng thái xóa
    };

    // Cập nhật áo thun
    $scope.updateShirt = function() {
        // Sao chép dữ liệu áo thun đang chỉnh sửa
        let updatedShirt = angular.copy($scope.editingShirt);
    
        // Chuyển brandId và categoryId thành đối tượng tương ứng
        updatedShirt.brand = { id: updatedShirt.brandId };  // Chuyển brandId thành đối tượng brand
        updatedShirt.category = { id: updatedShirt.categoryId };  // Chuyển categoryId thành đối tượng category
        
        // Đảm bảo cập nhật trạng thái
        updatedShirt.statusshirt = $scope.editingShirt.statusshirt;  // Trạng thái áo
        updatedShirt.deleted = $scope.editingShirt.deleted;  // Trạng thái xóa
        
        // Gửi yêu cầu cập nhật
        shirtService.updateShirt(updatedShirt.codeshirt, updatedShirt).then(function() {
            // Tải lại dữ liệu áo thun mới từ server (không cần tải lại trang)
            $scope.getShirts();
            
            // Đặt lại đối tượng đang chỉnh sửa
            $scope.editingShirt = null;
            
            // Chuyển hướng về màn hình chính hoặc danh sách áo thun
            $location.path('/');  // Kiểm tra xem $location đã được định nghĩa chưa
            
            // Đóng modal (đóng modal bằng Bootstrap)
            $('#editShirtModal').modal('hide');
        }, function(error) {
            // Hiển thị lỗi trên console nếu cần
            console.error("Error updating shirt", error);
            
        });
        
    };
    

    // Xem chi tiết áo thun
    $scope.viewShirtDetail = function(codeshirt) {
        shirtService.getShirtDetail(codeshirt).then(function(response) {
            $scope.selectedShirtDetail = response.data;
        });
    };

    $scope.getShirts();
    $scope.getBrands();
    $scope.getCategories();
}]);
