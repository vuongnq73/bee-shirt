var app = angular.module('BrandApp', []);
app.service('brandService', ['$http', function($http) {
    this.getBrands = function(page) {
        return $http.get(`http://localhost:8080/api/brands/list?page=${page}`);
    };

    this.getBrandDetail = function(codeBrand) {
        return $http.get(`http://localhost:8080/api/brands/detail/${codeBrand}`);
    };

    this.addBrand = function(brand) {
        return $http.post('http://localhost:8080/api/brands/add', brand);
    };

    this.updateBrand = function(codeBrand, brand) {
        return $http.put(`http://localhost:8080/api/brands/update/${codeBrand}`, brand);
    };

    this.deleteBrand = function(codeBrand) {
        return $http.put(`http://localhost:8080/api/brands/delete/${codeBrand}`);
    };
}]);

app.controller('brandController', ['$scope', 'brandService', function($scope, brandService) {
    $scope.brands = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.brand = {};
    $scope.newBrand = {};
    $scope.confirmDelete = false;
    $scope.brandToDelete = null;

    $scope.getBrands = function(page) {
        brandService.getBrands(page).then(function(response) {
            $scope.brands = response.data.content.map(function(item) {
                return {
                    codeBrand: item[0],
                    nameBrand: item[1],
                    statusBrand: item[2]
                };
            });
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };
    
    // Chuyển đến trang mới
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getBrands($scope.currentPage);
        }
    };

    $scope.viewBrandDetail = function(codeBrand) {
        brandService.getBrandDetail(codeBrand).then(function(response) {
            $scope.brand = response.data;
            $('#viewBrandDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddBrandModal = function() {
        $scope.newBrand = {};
    };

    $scope.saveNewBrand = function() {
        brandService.addBrand($scope.newBrand).then(function(response) {
            $scope.getBrands($scope.currentPage);
            $('#addBrandModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editBrand = function(brand) {
        $scope.brand = angular.copy(brand);
        $('#editBrandModal').modal('show');
    };

    $scope.saveEditBrand = function() {
        brandService.updateBrand($scope.brand.codeBrand, $scope.brand).then(function(response) {
            $scope.getBrands($scope.currentPage);
            $('#editBrandModal').modal('hide');
        });
    };

    $scope.deleteBrand = function(codeBrand) {
        $scope.brandToDelete = codeBrand;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteBrand = function() {
        brandService.deleteBrand($scope.brandToDelete).then(function(response) {
            $scope.getBrands($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getBrands($scope.currentPage);
}]);
