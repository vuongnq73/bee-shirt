var app = angular.module('OriginApp', []);
app.service('originService', ['$http', function($http) {
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

    this.getOrigins = function(page) {
        return $http.get(`http://localhost:8080/api/origins/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getOriginDetail = function(codeOrigin) {
        return $http.get(`http://localhost:8080/api/origins/detail/${codeOrigin}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addOrigin = function(origin) {
        return $http.post('http://localhost:8080/api/origins/add', origin, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateOrigin = function(codeOrigin, origin) {
        return $http.put(`http://localhost:8080/api/origins/update/${codeOrigin}`, origin, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteOrigin = function(codeOrigin) {
        return $http.put(`http://localhost:8080/api/origins/delete/${codeOrigin}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('originController', ['$scope', 'originService', function($scope, originService) {
    $scope.origins = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.origin = {};
    $scope.newOrigin = {};
    $scope.confirmDelete = false;
    $scope.originToDelete = null;

    $scope.getBrands = function(page) {
        brandService.getBrands(page).then(function(response) {
            console.log(response.data.content);  // Kiểm tra dữ liệu trong console
            $scope.brands = response.data.content; // Lưu dữ liệu vào $scope.brands
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };
    
    
    // Chuyển đến trang mới
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getOrigins($scope.currentPage);
        }
    };

    $scope.viewOriginDetail = function(codeOrigin) {
        originService.getOriginDetail(codeOrigin).then(function(response) {
            $scope.origin = response.data;
            $('#viewOriginDetailModal').modal('show');
        });
    };

    // Đóng modal
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddOriginModal = function() {
        $scope.newOrigin = {};
    };

    $scope.saveNewOrigin = function() {
        originService.addOrigin($scope.newOrigin).then(function(response) {
            $scope.getOrigins($scope.currentPage);
            $('#addOriginModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editOrigin = function(origin) {
        $scope.origin = angular.copy(origin);
        $('#editOriginModal').modal('show');
    };

    $scope.saveEditOrigin = function() {
        originService.updateOrigin($scope.origin.codeOrigin, $scope.origin).then(function(response) {
            $scope.getOrigins($scope.currentPage);
            $('#editOriginModal').modal('hide');
        });
    };

    $scope.deleteOrigin = function(codeOrigin) {
        $scope.originToDelete = codeOrigin;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteOrigin = function() {
        originService.deleteOrigin($scope.originToDelete).then(function(response) {
            $scope.getOrigins($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getOrigins($scope.currentPage);
}]);
