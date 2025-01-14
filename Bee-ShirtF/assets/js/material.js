var app = angular.module('MaterialApp', []);
app.service('materialService', ['$http', function($http) {
    function checkPermission() {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "/assets/account/login.html"; // Chuyển hướng đến trang đăng nhập
            return false;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles = payload.scope ? payload.scope.split(" ") : [];

        if (!roles.includes("ROLE_STAFF") && !roles.includes("ROLE_ADMIN")) {
            alert("Bạn không có quyền truy cập vào trang này!");
            window.history.back();
            return false;
        }

        return true;
    }

    if (!checkPermission()) return;
    const token = sessionStorage.getItem("jwtToken");

    this.getMaterials = function() {
        return $http.get('http://localhost:8080/api/materials/list', {
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
        return $http.put(`http://localhost:8080/api/materials/delete/${codeMaterial}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('materialController', ['$scope', 'materialService', function($scope, materialService) {
    $scope.material = {};
    $scope.newMaterial = {};
    $scope.confirmDelete = false;
    $scope.materialToDelete = null;

    $scope.statusFilter = '';
    $scope.searchText = '';
    $scope.itemsPerPage = 5;
    $scope.totalPages = 0;
    $scope.currentPage = 0;
    $scope.pages = [];

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status;
        $scope.getMaterials();
    };

    $scope.getMaterials = function() {
        materialService.getMaterials().then(function(response) {
            $scope.materials = response.data;

            $scope.filteredMaterials = $scope.materials.filter(function(material) {
                if ($scope.statusFilter !== '') {
                    return material.statusMaterial === parseInt($scope.statusFilter, 10);
                }
                return true;
            });

            if ($scope.searchText) {
                $scope.filteredMaterials = $scope.filteredMaterials.filter(function(material) {
                    return material.nameMaterial.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }

            $scope.totalPages = Math.ceil($scope.filteredMaterials.length / $scope.itemsPerPage);
            $scope.paginate(0);
        });
    };

    $scope.paginate = function(page) {
        $scope.currentPage = page;
        const dataToPaginate = $scope.filteredMaterials || $scope.materials;

        const start = page * $scope.itemsPerPage;
        const end = start + $scope.itemsPerPage;
        $scope.currentPageItems = dataToPaginate.slice(start, end);

        $scope.pages = [];
        for (let i = 0; i < $scope.totalPages; i++) {
            $scope.pages.push(i + 1);
        }
    };

    $scope.searchMaterial = function() {
        if ($scope.searchText) {
            $scope.currentPageItems = $scope.materials.filter(function(material) {
                return material.nameMaterial.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       material.codeMaterial.toLowerCase().includes($scope.searchText.toLowerCase());
            });

            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            $scope.paginate($scope.currentPage);
        }
    };

    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.paginate(page);
        }
    };

    $scope.sortOrder = $scope.sortOrder === 'asc' ? 'desc' : 'asc';

    $scope.sortMaterials = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.materials = $scope.materials.sort(function(a, b) {
                if (a[field] < b[field]) return -1;
                if (a[field] > b[field]) return 1;
                return 0;
            });
            $scope.sortOrder = 'desc';
        } else {
            $scope.materials = $scope.materials.sort(function(a, b) {
                if (a[field] < b[field]) return 1;
                if (a[field] > b[field]) return -1;
                return 0;
            });
            $scope.sortOrder = 'asc';
        }
    };

    $scope.viewMaterialDetail = function(codeMaterial) {
        materialService.getMaterialDetail(codeMaterial).then(function(response) {
            $scope.material = response.data;
            $('#viewMaterialDetailModal').modal('show');
        });
    };

    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddMaterialModal = function() {
        $scope.newMaterial = {};
    };

    $scope.editMaterial = function(material) {
        $scope.material = angular.copy(material);
        $('#editMaterialModal').modal('show');
    };

    $scope.saveNewMaterial = function() {
        const materialName = $scope.newMaterial.nameMaterial;
        const materialCode = $scope.newMaterial.codeMaterial;

        if (!materialName || materialName.trim() === "") {
            alert("Tên material không được để trống!");
            return;
        }

        if (materialName.length > 250) {
            alert("Tên material không được quá 250 ký tự!");
            return;
        }

        const trimmedName = materialName.trim();
        if (trimmedName.length === 0) {
            alert("Tên material không được chỉ chứa khoảng trắng!");
            return;
        }

        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên material không được chứa số!");
            return;
        }
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(trimmedName)) {
            alert("Tên danh mục không được chứa ký tự đặc biệt!");
            return;
        }


        if ($scope.materials.some(m => m.nameMaterial === $scope.newMaterial.nameMaterial)) {
            alert("Tên material này đã tồn tại!");
            return;
        }

        materialService.addMaterial($scope.newMaterial).then(function() {
            alert("Thêm material thành công!");
            $('#addMaterialModal').modal('hide');
            $scope.getMaterials();
        }).catch(function() {
            alert("Có lỗi xảy ra khi thêm material.");
        });
    };

    $scope.saveEditMaterial = function() {
        const materialName = $scope.material.nameMaterial;

        if (!materialName || materialName.trim() === "") {
            alert("Tên material không được để trống!");
            return;
        }

        if (materialName.length > 250) {
            alert("Tên material không được quá 250 ký tự!");
            return;
        }

        const trimmedName = materialName.trim();
        if (trimmedName.length === 0) {
            alert("Tên material không được chỉ chứa khoảng trắng!");
            return;
        }

        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên material không được chứa số!");
            return;
        }
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(trimmedName)) {
            alert("Tên danh mục không được chứa ký tự đặc biệt!");
            return;
        }
        

        materialService.updateMaterial($scope.material.codeMaterial, $scope.material).then(function() {
            alert("Cập nhật material thành công!");
            $('#editMaterialModal').modal('hide');
            $scope.getMaterials();
        }).catch(function() {
            alert("Có lỗi xảy ra khi cập nhật material.");
        });
    };

    $scope.deleteMaterial = function(codeMaterial) {
        $scope.materialToDelete = codeMaterial;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteMaterial = function() {
        materialService.deleteMaterial($scope.materialToDelete).then(function() {
            alert("Xóa material thành công!");
            $scope.getMaterials();
        }).catch(function() {
            alert("Có lỗi xảy ra khi xóa material.");
        });

        $('#confirmDeleteModal').modal('hide');
    };

    $scope.getMaterials();
}]);
