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

ShirtApp.controller('ShirtController', ['$scope', 'shirtService', function($scope, shirtService) {
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
    $scope.viewDetails = function (codeshirt) {
        // Chuyển hướng đến trang chi tiết sản phẩm với mã sản phẩm (codeShirt) như tham số query
        window.location.href = `ProductDetail.html?codeShirt=${codeshirt}`;
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
        const namePattern = /^[A-Za-zÀ-ÿ\s]+$/;
        
        // Kiểm tra tên áo thun
        if (!$scope.newShirt.nameshirt) {
            alert("Tên áo thun không được để trống!");
            return;
        } else if (!namePattern.test($scope.newShirt.nameshirt)) {
            alert("Tên áo thun chỉ được chứa chữ cái và khoảng trắng, không được nhập số hoặc ký tự đặc biệt!");
            return;
        } else if ($scope.newShirt.nameshirt.length > 120) {
            alert("Tên áo thun không được vượt quá 120 ký tự!");
            return;
        }
    
        // Kiểm tra trùng tên
        if ($scope.shirts.some(shirt => shirt.nameshirt === $scope.newShirt.nameshirt)) {
            alert("Tên áo thun đã tồn tại, vui lòng chọn tên khác!");
            return;
        }
    
        // Kiểm tra trùng thương hiệu
        if ($scope.brands.some(brand => brand.id === $scope.newShirt.brandId)) {
            alert("Thương hiệu đã tồn tại!");
            return;
        }
    
        // Kiểm tra trùng danh mục
        if ($scope.categories.some(category => category.id === $scope.newShirt.categoryId)) {
            alert("Danh mục đã tồn tại!");
            return;
        }
    
        // Xác nhận thêm mới
        if (confirm("Bạn có chắc muốn thêm áo thun này không?")) {
            $scope.newShirt.statusshirt = 0;
        
            // Gọi service để thêm áo thun
            shirtService.addShirt($scope.newShirt).then(function() {
                alert("Thêm áo thun thành công!");
                $scope.getShirts(); // Cập nhật danh sách
                $scope.newShirt = {}; // Reset form
            }).catch(function(error) {
                // Xử lý lỗi trả về từ backend
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
        // Kiểm tra xem tên có hợp lệ không
        if (!$scope.editingShirt.nameshirt || $scope.editingShirt.nameshirt.trim() === "") {
            alert("Tên áo không được để trống");
            return;
        }
        
    
        // Kiểm tra tên có chỉ chứa chữ, dấu và khoảng trắng
        var nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
        if (!nameRegex.test($scope.editingShirt.name)) {
            alert("Tên áo chỉ được chứa chữ cái, dấu và khoảng trắng, không được chứa ký tự đặc biệt khác");
            return;  // Dừng thực hiện nếu tên có ký tự đặc biệt ngoài dấu
        }
    
        // Xác nhận hành động cập nhật
        var confirmation = confirm("Bạn có chắc chắn muốn cập nhật áo thun này?");
        if (!confirmation) {
            return;  // Dừng thực hiện nếu người dùng không xác nhận
        }
    
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
