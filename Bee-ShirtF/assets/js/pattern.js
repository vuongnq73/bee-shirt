var app = angular.module('PatternApp', []);
app.service('patternService', ['$http', function($http) {

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

    this.getPatterns = function(page) {
        return $http.get(`http://localhost:8080/api/patterns/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getPatternDetail = function(codePattern) {
        return $http.get(`http://localhost:8080/api/patterns/detail/${codePattern}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addPattern = function(pattern) {
        return $http.post('http://localhost:8080/api/patterns/add', pattern, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updatePattern = function(codePattern, pattern) {
        return $http.put(`http://localhost:8080/api/patterns/update/${codePattern}`, pattern, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deletePattern = function(codePattern) {
        return $http.put(`http://localhost:8080/api/patterns/delete/${codePattern}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('patternController', ['$scope', 'patternService', function($scope, patternService) {
    $scope.patterns = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.pattern = {};
    $scope.newPattern = {};
    $scope.confirmDelete = false;
    $scope.patternToDelete = null;

    $scope.getPatterns = function(page) {
        patternService.getPatterns(page).then(function(response) {
            $scope.patterns = response.data.content.map(function(item) {
                return {
                    codePattern: item[0],
                    namePattern: item[1],
                    statusPattern: item[2]
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
            $scope.getPatterns($scope.currentPage);
        }
    };

    $scope.viewPatternDetail = function(codePattern) {
        patternService.getPatternDetail(codePattern).then(function(response) {
            $scope.pattern = response.data;
            $('#viewPatternDetailModal').modal('show');
        });
    };

    // Đóng modal
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddPatternModal = function() {
        $scope.newPattern = {};
    };

    $scope.saveNewPattern = function() {
        patternService.addPattern($scope.newPattern).then(function(response) {
            $scope.getPatterns($scope.currentPage);
            $('#addPatternModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editPattern = function(pattern) {
        $scope.pattern = angular.copy(pattern);
        $('#editPatternModal').modal('show');
    };

    $scope.saveEditPattern = function() {
        patternService.updatePattern($scope.pattern.codePattern, $scope.pattern).then(function(response) {
            $scope.getPatterns($scope.currentPage);
            $('#editPatternModal').modal('hide');
        });
    };

    $scope.deletePattern = function(codePattern) {
        $scope.patternToDelete = codePattern;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeletePattern = function() {
        patternService.deletePattern($scope.patternToDelete).then(function(response) {
            $scope.getPatterns($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getPatterns($scope.currentPage);
}]);
