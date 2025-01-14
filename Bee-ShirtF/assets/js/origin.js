var app = angular.module('OriginApp', []);
app.service('originService', ['$http', function($http) {
    function checkPermission() {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "/assets/account/login.html"; // Redirect to login page
            return false; // Stop if no token found
        }
    
        // Decode token and extract payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles = payload.scope ? payload.scope.split(" ") : [];
    
        if (!roles.includes("ROLE_STAFF") && !roles.includes("ROLE_ADMIN")) {
          alert("Bạn không có quyền truy cập vào trang này!");
          window.history.back();
          return false;
        }
    
        return true; // Allow if permissions are valid
    }
    
    if (!checkPermission()) return; // Check permissions before any action

    // Get token after permission check
    const token = sessionStorage.getItem("jwtToken");

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
    $scope.sortOrder = 'asc';

    // Sorting function
    $scope.sortOrigins = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.origins = $scope.origins.sort(function(a, b) {
                if (a[field] < b[field]) {
                    return -1;
                }
                if (a[field] > b[field]) {
                    return 1;
                }
                return 0;
            });
            $scope.sortOrder = 'desc';  // Switch to descending order
        } else {
            $scope.origins = $scope.origins.sort(function(a, b) {
                if (a[field] < b[field]) {
                    return 1;
                }
                if (a[field] > b[field]) {
                    return -1;
                }
                return 0;
            });
            $scope.sortOrder = 'asc';  // Switch to ascending order
        }
    };

    // Fetch origins with pagination
    $scope.getOrigins = function(page) {
        originService.getOrigins(page).then(function(response) {
            $scope.origins = response.data.content.map(function(item) {
                return {
                    codeOrigin: item[0],
                    nameOrigin: item[1],
                    statusOrigin: item[2]
                };
            });
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };

    // Navigate to specific page
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getOrigins($scope.currentPage);
        }
    };

    // View origin details
    $scope.viewOriginDetail = function(codeOrigin) {
        originService.getOriginDetail(codeOrigin).then(function(response) {
            $scope.origin = response.data;
            $('#viewOriginDetailModal').modal('show');
        });
    };

    // Close modal
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    // Open modal to add new origin
    $scope.openAddOriginModal = function() {
        $scope.newOrigin = {};
    };


    // Edit origin
    $scope.editOrigin = function(origin) {
        $scope.origin = angular.copy(origin);
        $('#editOriginModal').modal('show');
    };
    $scope.saveNewOrigin = function() {
        // Kiểm tra nếu tên gốc rỗng hoặc dài hơn 250 ký tự
        if (!$scope.newOrigin.nameOrigin || $scope.newOrigin.nameOrigin.length > 250) {
            alert("Tên gốc không được để trống và không được vượt quá 250 ký tự!");
            return;
        }
    
        // Kiểm tra nếu tên gốc có chứa ký tự đặc biệt
        const regex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]+$/;
        if (!regex.test($scope.newOrigin.nameOrigin)) {
            alert("Tên gốc không được chứa ký tự đặc biệt!");
            return;
        }
        
    
        // Kiểm tra nếu tên gốc đã tồn tại
        const isExist = $scope.origins.some(origin => origin.nameOrigin === $scope.newOrigin.nameOrigin);
        if (isExist) {
            alert("Tên gốc này đã tồn tại trong hệ thống!");
            return;
        }
    
        // Thực hiện thêm mới gốc
        originService.addOrigin($scope.newOrigin).then(function(response) {
            $scope.getOrigins($scope.currentPage);
            $('#addOriginModal').modal('hide');
            alert("Thêm gốc thành công!");
        });
    };
    
    $scope.saveEditOrigin = function() {
        // Kiểm tra nếu tên gốc rỗng hoặc dài hơn 250 ký tự
        if (!$scope.origin.nameOrigin || $scope.origin.nameOrigin.length > 250) {
            alert("Tên gốc không được để trống và không được vượt quá 250 ký tự!");
            return;
        }
    
        // Kiểm tra nếu tên gốc có chứa ký tự đặc biệt
        const regex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]+$/;
if (!regex.test($scope.newOrigin.nameOrigin)) {
    alert("Tên gốc không được chứa ký tự đặc biệt!");
    return;
}

    
        // Kiểm tra nếu tên gốc đã tồn tại
        const isExist = $scope.origins.some(origin => origin.nameOrigin === $scope.origin.nameOrigin);
        if (isExist) {
            alert("Tên gốc này đã tồn tại trong hệ thống!");
            return;
        }
    
        // Thực hiện cập nhật gốc
        originService.updateOrigin($scope.origin.codeOrigin, $scope.origin).then(function(response) {
            $scope.getOrigins($scope.currentPage);
            $('#editOriginModal').modal('hide');
            alert("Cập nhật gốc thành công!");
        });
    };
    
    // Mark origin for deletion
    $scope.deleteOrigin = function(codeOrigin) {
        $scope.originToDelete = codeOrigin;
        $('#confirmDeleteModal').modal('show');
    };

    // Confirm and delete origin
    $scope.confirmDeleteOrigin = function() {
        originService.deleteOrigin($scope.originToDelete).then(function(response) {
            $scope.getOrigins($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
            alert("Xóa thành công!");  // Thông báo xóa thành công
        });
    };

    // Initial load
    $scope.getOrigins($scope.currentPage);
}]);
