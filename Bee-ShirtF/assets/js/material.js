 
var app = angular.module('MaterialApp', []);
app.service('materialService', ['$http', function($http) {
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

    this.getMaterials = function(page) {
        return $http.get(`http://localhost:8080/api/materials/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getMaterialDetail = function(codeMaterial) {
        return $http.get(`http://localhost:8080/api/materials/detail/${codeMaterial}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addMaterial = function(material) {
        return $http.post('http://localhost:8080/api/materials/add', material, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateMaterial = function(codeMaterial, material) {
        return $http.put(`http://localhost:8080/api/materials/update/${codeMaterial}`, material, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteMaterial = function(codeMaterial) {
        return $http.put(`http://localhost:8080/api/materials/delete/${codeMaterial}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('materialController', ['$scope', 'materialService', function($scope, materialService) {
    $scope.materials = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.material = {};
    $scope.newMaterial = {};
    $scope.confirmDelete = false;
    $scope.materialToDelete = null;
$scope.sortOrder = 'asc';  // Biến lưu trữ thứ tự sắp xếp, 'asc' là tăng dần, 'desc' là giảm dần

// Hàm sắp xếp
$scope.sortMaterials = function(field) {
    if ($scope.sortOrder === 'asc') {
        // Nếu đang sắp xếp tăng dần, thì sắp xếp giảm dần
        $scope.materials = $scope.materials.sort(function(a, b) {
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
        $scope.materials = $scope.materials.sort(function(a, b) {
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

    $scope.getMaterials = function(page) {
        materialService.getMaterials(page).then(function(response) {
            $scope.materials = response.data.content.map(function(item) {
                return {
                    codeMaterial: item[0],
                    nameMaterial: item[1],
                    statusMaterial: item[2]
                };
            });
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };
    
    // Go to the next/previous page
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getMaterials($scope.currentPage);
        }
    };

    $scope.viewMaterialDetail = function(codeMaterial) {
        materialService.getMaterialDetail(codeMaterial).then(function(response) {
            $scope.material = response.data;
            $('#viewMaterialDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddMaterialModal = function() {
        $scope.newMaterial = {};
    };

    $scope.saveNewMaterial = function() {
        materialService.addMaterial($scope.newMaterial).then(function(response) {
            $scope.getMaterials($scope.currentPage);
            $('#addMaterialModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editMaterial = function(material) {
        $scope.material = angular.copy(material);
        $('#editMaterialModal').modal('show');
    };

    $scope.saveEditMaterial = function() {
        materialService.updateMaterial($scope.material.codeMaterial, $scope.material).then(function(response) {
            $scope.getMaterials($scope.currentPage);
            $('#editMaterialModal').modal('hide');
        });
    };

    $scope.deleteMaterial = function(codeMaterial) {
        $scope.materialToDelete = codeMaterial;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteMaterial = function() {
        materialService.deleteMaterial($scope.materialToDelete).then(function(response) {
            $scope.getMaterials($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getMaterials($scope.currentPage);
}]);