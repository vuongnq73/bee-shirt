var ShirtApp = angular.module('beeShirtApp', []);

ShirtApp.service('shirtService', ['$http', function($http) {
    const baseUrl = 'http://localhost:8080/shirts';
 
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

    this.getShirts = function() {
        return $http.get(baseUrl + '/api/hienthi', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addShirt = function(shirt) {
        return $http.post(baseUrl + '/add', shirt, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateShirt = function(codeshirt, shirt) {
        return $http.put(baseUrl + '/update/' + codeshirt, shirt, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteShirt = function(codeshirt) {
        return $http.delete(baseUrl + '/delete/' + codeshirt, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getShirtDetail = function(codeshirt) {
        return $http.get(baseUrl + '/byCode/' + codeshirt, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getBrands = function() {
        return $http.get(baseUrl + '/api/brands', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getCategories = function() {
        return $http.get(baseUrl + '/api/categories', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

ShirtApp.controller('ShirtController', ['$scope',  'shirtService','$location', function($scope, shirtService) {
    $scope.shirts = [];  // Danh sách áo thun đã lọc (hiển thị trên UI)
    $scope.allShirts = [];  // Danh sách áo thun ban đầu (không bị thay đổi khi lọc)
    $scope.brands = [];
    $scope.categories = [];
    $scope.newShirt = {};
    $scope.editingShirt = null; // Để lưu thông tin áo thun đang được chỉnh sửa
    $scope.selectedShirtDetail = null; // Để lưu thông tin áo thun đang xem chi tiết
    // Filters
    $scope.selectedBrand = null;
    $scope.selectedCategory = null;
    $scope.searchQuery = '';

    // Pagination
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
  
     // Lấy danh sách áo thun từ API
     $scope.getShirts = function() {
        shirtService.getShirts().then(function(response) {
            $scope.allShirts = response.data;  // Lưu tất cả áo thun gốc vào $scope.allShirts
            $scope.applyFilters();  // Áp dụng bộ lọc ngay khi lấy dữ liệu
        });
    };

    // Lấy danh sách thương hiệu từ API
    $scope.getBrands = function() {
        shirtService.getBrands().then(function(response) {
            $scope.brands = response.data;
        });
    };

    // Lấy danh sách danh mục từ API
    $scope.getCategories = function() {
        shirtService.getCategories().then(function(response) {
            $scope.categories = response.data;
        });
    };

    // Hàm lọc dữ liệu theo các lựa chọn của người dùng
    $scope.applyFilters = function() {
        let filteredShirts = $scope.allShirts;  // Sử dụng dữ liệu gốc để lọc

        // Lọc theo thương hiệu
        if ($scope.selectedBrand) {
            filteredShirts = filteredShirts.filter(function(shirt) {
                return shirt.brandId === $scope.selectedBrand.id;
            });
        }

        // Lọc theo danh mục
        if ($scope.selectedCategory) {
            filteredShirts = filteredShirts.filter(function(shirt) {
                return shirt.categoryId === $scope.selectedCategory.id;
            });
        }

        // Lọc theo từ khóa tìm kiếm (tên hoặc mã áo)
        if ($scope.searchQuery) {
            filteredShirts = filteredShirts.filter(function(shirt) {
                return shirt.nameshirt.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
                    shirt.codeshirt.toLowerCase().includes($scope.searchQuery.toLowerCase());
            });
        }

        // Cập nhật danh sách áo thun đã lọc
        $scope.shirts = filteredShirts;
        $scope.currentPage = 1;  // Reset trang về 1 mỗi khi lọc lại
    };

    // Lấy áo thun cho trang hiện tại sau khi lọc
    $scope.getShirtsForCurrentPage = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const endIndex = startIndex + $scope.itemsPerPage;
        return $scope.shirts.slice(startIndex, endIndex);
    };

    // Tính tổng số trang dựa trên danh sách áo thun đã lọc
    $scope.totalPages = function() {
        return Math.ceil($scope.shirts.length / $scope.itemsPerPage);
    };




    $scope.viewDetails = function (codeshirt) {
        // Chuyển hướng đến trang chi tiết sản phẩm với mã sản phẩm
        window.location.href = `ProductDetailByCode.html?codeShirt=${codeshirt}`;
    };
    
    
    $scope.addShirt = function() {
        const Kitudacbiet = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        const so = /[0-9]/;
    
        if ($scope.newShirt.nameshirt.length > 250) {
            alert("Tên áo thun không được vượt quá 250 ký tự!");
            return;
        } else if (so.test($scope.newShirt.nameshirt)) {
            alert("Tên áo phông không được có số");
            return; 
        } else if (Kitudacbiet.test($scope.newShirt.nameshirt)) {
            alert("Tên áo phông không được ký tự đặc biệt!");
            return;
        } else if (!$scope.newShirt.nameshirt) {
            alert("Tên áo thun không được để trống!");
            return;
        }
    
        if ($scope.shirts.some(shirt => shirt.nameshirt === $scope.newShirt.nameshirt)) {
            alert("Tên áo thun đã tồn tại, vui lòng chọn tên khác!");
            return;
        }
        if (confirm("Bạn có chắc muốn thêm áo thun này không?")) {
            shirtService.addShirt($scope.newShirt).then(function(response) {
                alert("Thêm áo thun thành công!");
                $scope.newShirt = {}; // Reset form
                $scope.getShirts();
                location.reload();
            }).catch(function(error) {
                if (error.data && error.data.message === "Tên áo thun đã tồn tại!") {
                    alert("Tên áo thun đã tồn tại, vui lòng chọn tên khác!");
                } else {
                    console.error(error); // Log lỗi chi tiết
                    alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
                }
            });
        }
    };
    
    
    
    

    $scope.deleteShirt = function(codeshirt) {
        if (confirm('Bạn có chắc chắn muốn xóa áo này không?')) {
            shirtService.deleteShirt(codeshirt).then(function() {
                alert("Xóa sản phẩm thành công");
                $scope.getShirts();
                location.reload();
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

    $scope.updateShirt = function() {
        const Kitudacbiet = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        const so = /[0-9]/;
    
        // Kiểm tra tên áo thun
        if ($scope.editingShirt.nameshirt.length > 250) {
            alert("Tên áo thun không được vượt quá 250 ký tự!");
            return;
        } else if (so.test($scope.editingShirt.nameshirt)) {
            alert("Tên áo phông không được có số");
            return; 
        } else if (Kitudacbiet.test($scope.editingShirt.nameshirt)) {
            alert("Tên áo phông không được ký tự đặc biệt!");
            return;
        } else if (!$scope.editingShirt.nameshirt) {
            alert("Tên áo thun không được để trống!");
            return;
        }
    
        // Kiểm tra trùng tên
        if ($scope.shirts.some(shirt => shirt.nameshirt === $scope.editingShirt.nameshirt && shirt.codeshirt !== $scope.editingShirt.codeshirt)) {
            alert("Tên áo thun đã tồn tại, vui lòng chọn tên khác!");
            return;
        }
    
        // Xác nhận hành động cập nhật
        var confirmation = confirm("Bạn có chắc chắn muốn cập nhật áo thun này?");
        if (!confirmation) {
            return;  // Dừng thực hiện nếu người dùng không xác nhận
        }
    
        // Cập nhật dữ liệu áo thun đang chỉnh sửa
        let updatedShirt = angular.copy($scope.editingShirt);
    
        // Chuyển brandId và categoryId thành đối tượng tương ứng
        updatedShirt.brand = { id: updatedShirt.brandId };  // Chuyển brandId thành đối tượng brand
        updatedShirt.category = { id: updatedShirt.categoryId };  // Chuyển categoryId thành đối tượng category
    
        // Đảm bảo trạng thái đúng
        updatedShirt.statusshirt = $scope.editingShirt.statusshirt;  // Trạng thái áo
        updatedShirt.deleted = $scope.editingShirt.deleted;  // Trạng thái xóa
    
        // Gửi yêu cầu cập nhật
        shirtService.updateShirt(updatedShirt.codeshirt, updatedShirt).then(function() {
            // Tải lại dữ liệu áo thun mới từ server (không cần tải lại trang)
            $scope.getShirts();
            alert("Sửa sản phẩm thành công");
            // Đặt lại đối tượng đang chỉnh sửa
            $scope.editingShirt = null;

    
            // Đóng modal (đóng modal bằng Bootstrap)
            $('#editShirtModal').modal('hide');
            location.reload();
        }, function(error) {
            // Hiển thị lỗi trên console nếu cần
            console.error("Error updating shirt", error);
        });
    };
    
    
    

    $scope.goToShirtDetail = function(codeshirt) {
        // Điều hướng đến trang chi tiết với mã sản phẩm
        $location.path('http://localhost:8080/shirt-details/byCode/' + codeshirt);
    };

    $scope.getShirts();
    $scope.getBrands();
    $scope.getCategories();
}]);
