var app = angular.module('SizeApp', []);
        app.service('sizeService', ['$http', function($http) {
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
        
            this.getSizes = function(page) {
                return $http.get(`http://localhost:8080/api/sizes/list?page=${page}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });
            };

            this.getSizeDetail = function(codeSize) {
                return $http.get(`http://localhost:8080/api/sizes/detail/${codeSize}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });
            };

            this.addSize = function(size) {
                return $http.post('http://localhost:8080/api/sizes/add', size, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });
            };

            this.updateSize = function(codeSize, size) {
                return $http.put(`http://localhost:8080/api/sizes/update/${codeSize}`, size, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });
            };

            this.deleteSize = function(codeSize) {
                return $http.put(`http://localhost:8080/api/sizes/delete/${codeSize}`, {
                    headers: {
                        Authorization: "Bearer " + token,
                    }
                });
            };
        }]);

        app.controller('sizeController', ['$scope', 'sizeService', function($scope, sizeService) {
            $scope.sizes = [];
            $scope.currentPage = 0;
            $scope.totalPages = 0;
            $scope.pages = [];
            $scope.size = {};
            $scope.newSize = {};
            $scope.confirmDelete = false;
            $scope.sizeToDelete = null;

            $scope.getSizes = function(page) {
                sizeService.getSizes(page).then(function(response) {
                    $scope.sizes = response.data.content.map(function(item) {
                        return {
                            codeSize: item[0],
                            namesize: item[1],
                            statussize: item[2]
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
                    $scope.getSizes($scope.currentPage);
                }
            };

            $scope.viewSizeDetail = function(codeSize) {
                sizeService.getSizeDetail(codeSize).then(function(response) {
                    $scope.size = response.data;
                    $('#viewSizeDetailModal').modal('show');
                });
            };

            $scope.openAddSizeModal = function() {
                $scope.newSize = {};
            };

            $scope.saveNewSize = function() {
                sizeService.addSize($scope.newSize).then(function(response) {
                    $scope.getSizes($scope.currentPage);
                    $('#addSizeModal').modal('hide');
                });
            };

            $scope.editSize = function(size) {
                $scope.size = angular.copy(size);
                $('#editSizeModal').modal('show');
            };

            $scope.saveEditSize = function() {
                sizeService.updateSize($scope.size.codeSize, $scope.size).then(function(response) {
                    $scope.getSizes($scope.currentPage);
                    $('#editSizeModal').modal('hide');
                });
            };

            $scope.deleteSize = function(codeSize) {
                $scope.sizeToDelete = codeSize;
                $('#confirmDeleteModal').modal('show');
            };

            $scope.confirmDeleteSize = function() {
                sizeService.deleteSize($scope.sizeToDelete).then(function(response) {
                    $scope.getSizes($scope.currentPage);
                    $('#confirmDeleteModal').modal('hide');
                });
            };

            $scope.getSizes($scope.currentPage);
        }]);