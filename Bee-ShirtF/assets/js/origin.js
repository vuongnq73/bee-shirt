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

        const validRoles = roles.filter(role => rolePriority[role]);
        validRoles.sort((a, b) => rolePriority[a] - rolePriority[b]);

        return validRoles[0] || null;
    }

    this.getOrigins = function() {
        return $http.get('http://localhost:8080/api/origins/list', {
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
        return $http.put(`http://localhost:8080/api/origins/delete/${codeOrigin}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('originController', ['$scope', 'originService', function($scope, originService) {
    $scope.origin = {};
    $scope.newOrigin = {};
    $scope.confirmDelete = false;
    $scope.originToDelete = null;

    $scope.statusFilter = '';
    $scope.searchText = '';
    $scope.itemsPerPage = 5;
    $scope.totalPages = 0;
    $scope.currentPage = 0;
    $scope.pages = [];

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status;
        $scope.getOrigins();
    };
    
    $scope.getOrigins = function() {
        originService.getOrigins().then(function(response) {
            $scope.origins = response.data;

            $scope.filteredOrigins = $scope.origins.filter(function(origin) {
                if ($scope.statusFilter !== '') {
                    return origin.statusOrigin === parseInt($scope.statusFilter, 10);
                }
                return true;
            });

            if ($scope.searchText) {
                $scope.filteredOrigins = $scope.filteredOrigins.filter(function(origin) {
                    return origin.nameOrigin.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }

            $scope.totalPages = Math.ceil($scope.filteredOrigins.length / $scope.itemsPerPage);
            $scope.paginate(0);
        });
    };

    $scope.paginate = function(page) {
        $scope.currentPage = page;

        const dataToPaginate = $scope.filteredOrigins || $scope.origins;
        const start = page * $scope.itemsPerPage;
        const end = start + $scope.itemsPerPage;

        $scope.currentPageItems = dataToPaginate.slice(start, end);

        $scope.pages = [];
        for (let i = 0; i < $scope.totalPages; i++) {
            $scope.pages.push(i + 1);
        }
    };

    $scope.searchOrigin = function() {
        if ($scope.searchText) {
            $scope.currentPageItems = $scope.origins.filter(function(origin) {
                return origin.nameOrigin.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       origin.codeOrigin.toLowerCase().includes($scope.searchText.toLowerCase());
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

    $scope.sortOrigins = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.origins = $scope.origins.sort(function(a, b) {
                return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
            });
            $scope.sortOrder = 'desc';
        } else {
            $scope.origins = $scope.origins.sort(function(a, b) {
                return a[field] < b[field] ? 1 : a[field] > b[field] ? -1 : 0;
            });
            $scope.sortOrder = 'asc';
        }
    };

    $scope.viewOriginDetail = function(codeOrigin) {
        originService.getOriginDetail(codeOrigin).then(function(response) {
            $scope.origin = response.data;
            $('#viewOriginDetailModal').modal('show');
        });
    };

    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddOriginModal = function() {
        $scope.newOrigin = {};
    };

    $scope.editOrigin = function(origin) {
        $scope.origin = angular.copy(origin);
        $('#editOriginModal').modal('show');
    };

    $scope.saveNewOrigin = function() {
        const originName = $scope.newOrigin.nameOrigin;

        if (!originName || originName.trim() === "") {
            alert("Tên nguồn gốc không được để trống!");
            return;
        }

        if (originName.length > 250) {
            alert("Tên nguồn gốc không được quá 250 ký tự!");
            return;
        }

        const trimmedName = originName.trim();
        if (trimmedName.length === 0) {
            alert("Tên nguồn gốc không được chỉ chứa khoảng trắng!");
            return;
        }

        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên nguồn gốc không được chứa số!");
            return;
        }


        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa ký tự đặc biệt!");
                return;
            }
        let isDuplicate = $scope.origins.some(function(item) {
            return item.nameOrigin.toLowerCase() === originName.toLowerCase() || item.codeOrigin === $scope.newOrigin.codeOrigin;
        });

        if (isDuplicate) {
            alert("Tên nguồn gốc hoặc mã nguồn gốc này đã tồn tại!");
            return;
        }

        if (confirm("Bạn có chắc chắn muốn thêm nguồn gốc này?")) {
            originService.addOrigin($scope.newOrigin).then(function(response) {
                alert("Thêm nguồn gốc thành công!");
                $scope.getOrigins($scope.currentPage);
                $('#addOriginModal').modal('hide');
                location.reload();
            }, function(error) {
                alert("Có lỗi xảy ra khi thêm nguồn gốc.");
            });
        }
    };

    $scope.saveEditOrigin = function() {
        const originName = $scope.origin.nameOrigin;

        if (!originName || originName.trim() === "") {
            alert("Tên nguồn gốc không được để trống!");
            return;
        }

        if (originName.length > 250) {
             alert("Tên nguồn gốc không được quá 250 ký tự!"); 
             return; 
            }
            const trimmedName = originName.trim();
            if (trimmedName.length === 0) {
                alert("Tên nguồn gốc không được chỉ chứa khoảng trắng!");
                return;
            }
        
            const containsNumberRegex = /[0-9]/;
            if (containsNumberRegex.test(trimmedName)) {
                alert("Tên nguồn gốc không được chứa số!");
                return;
            }
        
            const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa ký tự đặc biệt!");
                return;
            }
        
            let isDuplicate = $scope.origins.some(function(item) {
                return item.nameOrigin.toLowerCase() === originName.toLowerCase() && item.codeOrigin !== $scope.origin.codeOrigin;
            });
        
            if (isDuplicate) {
                alert("Tên nguồn gốc này đã tồn tại!");
                return;
            }
        
            if (confirm("Bạn có chắc chắn muốn cập nhật nguồn gốc này?")) {
                originService.updateOrigin($scope.origin.codeOrigin, $scope.origin).then(function(response) {
                    alert("Cập nhật nguồn gốc thành công!");
                    $scope.getOrigins($scope.currentPage);
                    $('#editOriginModal').modal('hide');
                }, function(error) {
                    alert("Có lỗi xảy ra khi cập nhật nguồn gốc.");
                });
            }
        };
        
        $scope.confirmDeleteOrigin = function(origin) {
            $scope.confirmDelete = true;
            $scope.originToDelete = origin;
            $('#deleteOriginModal').modal('show');
        };
        
        $scope.deleteOrigin = function() {
            if ($scope.originToDelete) {
                originService.deleteOrigin($scope.originToDelete.codeOrigin).then(function(response) {
                    alert("Xóa nguồn gốc thành công!");
                    $scope.getOrigins($scope.currentPage);
                    $('#deleteOriginModal').modal('hide');
                }, function(error) {
                    alert("Có lỗi xảy ra khi xóa nguồn gốc.");
                });
            }
        };
        
        // Initialize by fetching origins
        $scope.getOrigins();
    }]);      