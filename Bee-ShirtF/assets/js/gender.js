var app = angular.module('GenderApp', []);
app.service('genderService', ['$http', function($http) {
    // Hàm kiểm tra quyền truy cập
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
    
    // Kiểm tra quyền trước khi thực hiện bất kỳ hành động nào
    if (!checkPermission()) return;
    
    const token = sessionStorage.getItem("jwtToken");

    // Lấy danh sách giới tính
    this.getGenders = function(page) {
        return $http.get(`http://localhost:8080/api/genders/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    // Lấy chi tiết giới tính
    this.getGenderDetail = function(codeGender) {
        return $http.get(`http://localhost:8080/api/genders/detail/${codeGender}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    // Thêm giới tính
    this.addGender = function(gender) {
        return $http.post('http://localhost:8080/api/genders/add', gender, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    // Cập nhật giới tính
    this.updateGender = function(codeGender, gender) {
        return $http.put(`http://localhost:8080/api/genders/update/${codeGender}`, gender, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    // Xóa giới tính
    this.deleteGender = function(codeGender) {
        return $http.put(`http://localhost:8080/api/genders/delete/${codeGender}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        })
    };

}]);
app.controller('genderController', ['$scope', 'genderService', function($scope, genderService) {
    // Các biến cần thiết
    $scope.genders = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.gender = {};
    $scope.newGender = {};
    $scope.confirmDelete = false;
    $scope.genderToDelete = null;

    // Kiểm tra tên không có ký tự đặc biệt và chỉ có chữ
    $scope.isValidGenderName = function(name) {
        const regex = /^[a-zA-ZÀ-ỹà-ỹ ]+$/;  // Chỉ cho phép chữ cái và dấu cách
        return regex.test(name) && name.trim().length > 0;  // Kiểm tra không trống và chỉ có chữ cái
    };

    // Kiểm tra tên giới tính có bị trùng hay không
    $scope.isGenderNameDuplicate = function(name) {
        return $scope.genders.some(function(gender) {
            return gender.nameGender.toLowerCase() === name.toLowerCase();  // So sánh không phân biệt chữ hoa chữ thường
        });
    };

    // Lấy danh sách giới tính
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
        }).catch(function(error) {
            alert("Không thể tải danh sách giới tính. Vui lòng thử lại.");
            console.error("Lỗi khi tải danh sách giới tính:", error);
        });
    };

    // Lưu giới tính mới
    $scope.saveNewGender = function() {
        if (!$scope.isValidGenderName($scope.newGender.nameGender)) {
            alert("Tên giới tính không hợp lệ. Vui lòng nhập tên chỉ bao gồm chữ và dấu cách.");
            return;
        }
        if ($scope.isGenderNameDuplicate($scope.newGender.nameGender)) {
            alert("Tên giới tính đã tồn tại. Vui lòng nhập tên khác.");
            return;
        }

        genderService.addGender($scope.newGender).then(function(response) {
            $scope.getGenders($scope.currentPage);
            $('#addGenderModal').modal('hide');
            location.reload();
        }).catch(function(error) {
            alert("Lỗi khi thêm giới tính. Vui lòng thử lại.");
            console.error("Lỗi khi thêm giới tính:", error);
        });
    };

    // Lưu sửa giới tính
    $scope.saveEditGender = function() {
        if (!$scope.isValidGenderName($scope.gender.nameGender)) {
            alert("Tên giới tính không hợp lệ. Vui lòng nhập tên chỉ bao gồm chữ và dấu cách.");
            return;
        }
        if ($scope.isGenderNameDuplicate($scope.gender.nameGender)) {
            alert("Tên giới tính đã tồn tại. Vui lòng nhập tên khác.");
            return;
        }

        genderService.updateGender($scope.gender.codeGender, $scope.gender).then(function(response) {
            $scope.getGenders($scope.currentPage);
            $('#editGenderModal').modal('hide');
        }).catch(function(error) {
            alert("Lỗi khi cập nhật giới tính. Vui lòng thử lại.");
            console.error("Lỗi khi cập nhật giới tính:", error);
        });
    };

    // Các phương thức khác của controller

    // Lấy danh sách giới tính ban đầu
    $scope.getGenders($scope.currentPage);
}]);

