 
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
    $scope.sortOrder = 'asc'; // Thứ tự sắp xếp

    // Hàm kiểm tra tên không chứa ký tự đặc biệt và không quá 250 ký tự
    $scope.isValidMaterialName = function(name) {
        const regex = /^[a-zA-ZÀ-ỹà-ỹ0-9 ]+$/;  // Chỉ cho phép chữ cái, chữ số và dấu cách
        return regex.test(name) && name.trim().length <= 250;  // Kiểm tra không trống và không quá 250 ký tự
    };

    // Kiểm tra tên vật liệu có trùng không
    $scope.isMaterialNameDuplicate = function(name) {
        return $scope.materials.some(function(material) {
            return material.nameMaterial.toLowerCase() === name.toLowerCase();  // So sánh không phân biệt chữ hoa chữ thường
        });
    };

    // Sắp xếp danh sách vật liệu
    $scope.sortMaterials = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.materials.sort(function(a, b) {
                return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
            });
            $scope.sortOrder = 'desc';
        } else {
            $scope.materials.sort(function(a, b) {
                return a[field] < b[field] ? 1 : a[field] > b[field] ? -1 : 0;
            });
            $scope.sortOrder = 'asc';
        }
    };

    // Lấy danh sách vật liệu
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

    // Lấy chi tiết vật liệu
    $scope.viewMaterialDetail = function(codeMaterial) {
        materialService.getMaterialDetail(codeMaterial).then(function(response) {
            $scope.material = response.data;
            $('#viewMaterialDetailModal').modal('show');
        });
    };

    // Thêm vật liệu mới
    $scope.openAddMaterialModal = function() {
        $scope.newMaterial = {};
    };

    $scope.saveNewMaterial = function() {
        if (!$scope.isValidMaterialName($scope.newMaterial.nameMaterial)) {
            alert("Tên vật liệu không hợp lệ. Vui lòng nhập tên không chứa ký tự đặc biệt và không quá 250 ký tự.");
            return;
        }

        if ($scope.isMaterialNameDuplicate($scope.newMaterial.nameMaterial)) {
            alert("Tên vật liệu đã tồn tại. Vui lòng nhập tên khác.");
            return;
        }

        // Xác nhận trước khi thêm
        if (confirm("Bạn chắc chắn muốn thêm vật liệu này?")) {
            materialService.addMaterial($scope.newMaterial).then(function(response) {
                $scope.getMaterials($scope.currentPage);
                $('#addMaterialModal').modal('hide');
                alert("Sửa thành công");

            });
        }
    };

    // Chỉnh sửa vật liệu
    $scope.editMaterial = function(material) {
        $scope.material = angular.copy(material);
        $('#editMaterialModal').modal('show');
    };

    $scope.saveEditMaterial = function() {
        if (!$scope.isValidMaterialName($scope.material.nameMaterial)) {
            alert("Tên vật liệu không hợp lệ. Vui lòng nhập tên không chứa ký tự đặc biệt và không quá 250 ký tự.");
            return;
        }

        if ($scope.isMaterialNameDuplicate($scope.material.nameMaterial)) {
            alert("Tên vật liệu đã tồn tại. Vui lòng nhập tên khác.");
            return;
        }

        // Xác nhận trước khi sửa
        if (confirm("Bạn chắc chắn muốn sửa vật liệu này?")) {
            materialService.updateMaterial($scope.material.codeMaterial, $scope.material).then(function(response) {
                $scope.getMaterials($scope.currentPage);
                alert("Sửa thành công");
                $('#editMaterialModal').modal('hide');
                
            });
        }
    };

    // Xóa vật liệu
    $scope.deleteMaterial = function(codeMaterial) {
        $scope.materialToDelete = codeMaterial;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteMaterial = function() {
        // Xác nhận trước khi xóa
        if (confirm("Bạn chắc chắn muốn xóa vật liệu này?")) {
            materialService.deleteMaterial($scope.materialToDelete).then(function(response) {
                $scope.getMaterials($scope.currentPage);
                $('#confirmDeleteModal').modal('hide');
            });
        }
    };

    // Lấy danh sách vật liệu khi load trang
    $scope.getMaterials($scope.currentPage);
}]);
