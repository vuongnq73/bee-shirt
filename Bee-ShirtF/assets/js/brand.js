var app = angular.module('BrandApp', []);

app.service('brandService', ['$http', function($http) {
    function checkPermission() {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "/assets/account/login.html"; // Chuyển hướng đến trang đăng nhập
            return false; // Dừng lại nếu không có token
        }
    
        // Giải mã token và lấy payload
        const payload = JSON.parse(atob(token.split(".")[1]));
    
        const roles = payload.scope ? payload.scope.split(" ") : [];
    
        if (!roles.includes("ROLE_STAFF") && !roles.includes("ROLE_ADMIN")) {
          alert("Bạn không có quyền truy cập vào trang này!");
          window.history.back();
          return false;
        }
    
        return true; // Cho phép tiếp tục nếu có quyền
    }
    
    if (!checkPermission()) return; // Kiểm tra quyền trước khi thực hiện bất kỳ hành động nào
    // Lấy token từ sessionStorage sau khi đã kiểm tra quyền
const token = sessionStorage.getItem("jwtToken");

function getHighestRole(scopes) {
    const roles = scopes ? scopes.split(" ") : [];
    const rolePriority = {
        ROLE_ADMIN: 1,
        ROLE_STAFF: 2,
        ROLE_USER: 3,
    };

    // Lọc các vai trò hợp lệ và sắp xếp theo độ ưu tiên
    const validRoles = roles.filter(role => rolePriority[role]);
    validRoles.sort((a, b) => rolePriority[a] - rolePriority[b]);

    // Trả về vai trò có độ ưu tiên cao nhất
    return validRoles[0] || null;
}
    this.getBrands = function(page) {
        return $http.get(`http://localhost:8080/api/brands/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getBrandDetail = function(codeBrand) {
        return $http.get(`http://localhost:8080/api/brands/detail/${codeBrand}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addBrand = function(brand) {
        return $http.post('http://localhost:8080/api/brands/add', brand, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateBrand = function(codeBrand, brand) {
        return $http.put(`http://localhost:8080/api/brands/update/${codeBrand}`, brand, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteBrand = function(codeBrand) {
        return $http.put(`http://localhost:8080/api/brands/delete/${codeBrand}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
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

    // Hàm lấy danh sách thương hiệu
    function getBrands() {
        brandService.getBrands($scope.currentPage).then(function(response) {
            $scope.brands = response.data.content;
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    }

    getBrands();

    $scope.sortOrder = 'asc';  // Biến lưu trữ thứ tự sắp xếp, 'asc' là tăng dần, 'desc' là giảm dần

    // Hàm sắp xếp
    $scope.sortBrands = function(field) {
        if ($scope.sortOrder === 'asc') {
            // Nếu đang sắp xếp tăng dần, thì sắp xếp giảm dần
            $scope.brands = $scope.brands.sort(function(a, b) {
                if (a[field] < b[field]) {
                    return -1;
                }
                if (a[field] > b[field]) {
                    return 1;
                }
                return 0;
            });
            $scope.sortOrder = 'desc';  // Sau khi sắp xếp xong, đổi sang giảm dần
        } else {
            // Nếu đang sắp xếp giảm dần, thì sắp xếp tăng dần
            $scope.brands = $scope.brands.sort(function(a, b) {
                if (a[field] < b[field]) {
                    return 1;
                }
                if (a[field] > b[field]) {
                    return -1;
                }
                return 0;
            });
            $scope.sortOrder = 'asc';  // Sau khi sắp xếp xong, đổi sang tăng dần
        }
    };
    // Hàm thay đổi trang
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            getBrands();
        }
    };

    // Hàm mở modal thêm thương hiệu
    $scope.openAddBrandModal = function() {
        $scope.newBrand = {};
    };

    // Hàm lưu thương hiệu mới
    $scope.saveNewBrand = function() {
        brandService.addBrand($scope.newBrand).then(function() {
            getBrands();
            $('#addBrandModal').modal('hide');
        });
    };

    // Hàm xóa thương hiệu
    $scope.deleteBrand = function(codeBrand) {
        brandService.deleteBrand(codeBrand).then(function() {
            getBrands();
        });
    };

    // Hàm mở modal chỉnh sửa thương hiệu
    $scope.editBrand = function(brand) {
        $scope.brand = angular.copy(brand);
        $('#editBrandModal').modal('show');
    };

    // Hàm cập nhật thương hiệu
    $scope.saveEditBrand = function() {
        brandService.updateBrand($scope.brand.codeBrand, $scope.brand).then(function() {
            getBrands();
            $('#editBrandModal').modal('hide');
        });
    };
}]);