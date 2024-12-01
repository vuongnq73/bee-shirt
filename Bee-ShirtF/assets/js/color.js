var app = angular.module('ColorApp', []);
app.service('colorService', ['$http', function($http) {
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

    this.getColors = function(page) {
        return $http.get(`http://localhost:8080/api/colors/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getColorDetail = function(codeColor) {
        return $http.get(`http://localhost:8080/api/colors/detail/${codeColor}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addColor = function(color) {
        return $http.post('http://localhost:8080/api/colors/add', color, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateColor = function(codeColor, color) {
        return $http.put(`http://localhost:8080/api/colors/update/${codeColor}`, color, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteColor = function(codeColor) {
        return $http.put(`http://localhost:8080/api/colors/delete/${codeColor}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('colorController', ['$scope', 'colorService', function($scope, colorService) {
    $scope.colors = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.color = {};
    $scope.newColor = {};
    $scope.confirmDelete = false;
    $scope.colorToDelete = null;

    $scope.getColors = function(page) {
        colorService.getColors(page).then(function(response) {
            $scope.colors = response.data.content.map(function(item) {
                return {
                    codeColor: item[0],
                    nameColor: item[1],
                    statusColor: item[2]
                };
            });
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };
    
    $scope.sortOrder = 'asc';  // Biến lưu trữ thứ tự sắp xếp, 'asc' là tăng dần, 'desc' là giảm dần

    // Hàm sắp xếp
    $scope.sortColor = function(field) {
        if ($scope.sortOrder === 'asc') {
            // Nếu đang sắp xếp tăng dần, thì sắp xếp giảm dần
            $scope.colors = $scope.colors.sort(function(a, b) {
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
            $scope.colors = $scope.colors.sort(function(a, b) {
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
    // Chuyển đến trang mới
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getColors($scope.currentPage);
        }
    };

    $scope.viewColorDetail = function(codeColor) {
        colorService.getColorDetail(codeColor).then(function(response) {
            $scope.color = response.data;
            $('#viewColorDetailModal').modal('show');
        });
    };
  // Close modal function
  $scope.closeModal = function(modalId) {
    $(`#${modalId}`).modal('hide');
};
    $scope.openAddColorModal = function() {
        $scope.newColor = {};
    };

    $scope.saveNewColor = function() {
        colorService.addColor($scope.newColor).then(function(response) {
            $scope.getColors($scope.currentPage);
            $('#addColorModal').modal('hide');
            location.reload(); 

        });
    };

    $scope.editColor = function(color) {
        $scope.color = angular.copy(color);
        $('#editColorModal').modal('show');

    };

    $scope.saveEditColor = function() {
        colorService.updateColor($scope.color.codeColor, $scope.color).then(function(response) {
            $scope.getColors($scope.currentPage);
            $('#editColorModal').modal('hide');
        });
    };

    $scope.deleteColor = function(codeColor) {
        $scope.colorToDelete = codeColor;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteColor = function() {
        colorService.deleteColor($scope.colorToDelete).then(function(response) {
            $scope.getColors($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getColors($scope.currentPage);
}]);
