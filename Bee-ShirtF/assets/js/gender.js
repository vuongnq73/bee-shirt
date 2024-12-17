var app = angular.module('GenderApp', []);
app.service('genderService', ['$http', function($http) {
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

    this.getGenders = function(page) {
        return $http.get(`http://localhost:8080/api/genders/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getGenderDetail = function(codeGender) {
        return $http.get(`http://localhost:8080/api/genders/detail/${codeGender}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addGender = function(gender) {
        return $http.post('http://localhost:8080/api/genders/add', gender, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateGender = function(codeGender, gender) {
        return $http.put(`http://localhost:8080/api/genders/update/${codeGender}`, gender, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteGender = function(codeGender) {
        return $http.put(`http://localhost:8080/api/genders/delete/${codeGender}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('genderController', ['$scope', 'genderService', function($scope, genderService) {
    $scope.genders = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.gender = {};
    $scope.newGender = {};
    $scope.confirmDelete = false;
    $scope.genderToDelete = null;

    $scope.getGenders = function(page) {
        genderService.getGenders(page).then(function(response) {
            $scope.genders = response.data.content.map(function(item) {
                return {
                    codeGender: item[0],
                    nameGender: item[1],
                    statusGender: item[2]
                };
            });
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };

    $scope.sortOrder = 'asc';  // Biến lưu trữ thứ tự sắp xếp, 'asc' là tăng dần, 'desc' là giảm dần

    // Hàm sắp xếp
    $scope.sortGender = function(field) {
        if ($scope.sortOrder === 'asc') {
            // Nếu đang sắp xếp tăng dần, thì sắp xếp giảm dần
            $scope.genders = $scope.genders.sort(function(a, b) {
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
            $scope.genders = $scope.genders.sort(function(a, b) {
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
            $scope.getGenders($scope.currentPage);
        }
    };

    $scope.viewGenderDetail = function(codeGender) {
        genderService.getGenderDetail(codeGender).then(function(response) {
            $scope.gender = response.data;
            $('#viewGenderDetailModal').modal('show');
        });
    };

    // Đóng modal
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddGenderModal = function() {
        $scope.newGender = {};
    };

    $scope.saveNewGender = function() {
        genderService.addGender($scope.newGender).then(function(response) {
            $scope.getGenders($scope.currentPage);
            $('#addGenderModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editGender = function(gender) {
        $scope.gender = angular.copy(gender);
        $('#editGenderModal').modal('show');
    };

    $scope.saveEditGender = function() {
        genderService.updateGender($scope.gender.codeGender, $scope.gender).then(function(response) {
            $scope.getGenders($scope.currentPage);
            $('#editGenderModal').modal('hide');
        });
    };

    $scope.deleteGender = function(codeGender) {
        $scope.genderToDelete = codeGender;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteGender = function() {
        genderService.deleteGender($scope.genderToDelete).then(function(response) {
            $scope.getGenders($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getGenders($scope.currentPage);
}]);
