var app = angular.module('ColorApp', []);

app.service('colorService', ['$http', function($http) {
    function checkPermission() {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            window.location.href = "/assets/account/login.html"; // Redirect to login page
            return false; // Stop if no token
        }

        // Decode the token and get the payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles = payload.scope ? payload.scope.split(" ") : [];

        if (!roles.includes("ROLE_STAFF") && !roles.includes("ROLE_ADMIN")) {
            alert("Bạn không có quyền truy cập vào trang này!");
            window.history.back(); // Go back if no permission
            return false;
        }

        return true; // Continue if has permission
    }

    if (!checkPermission()) return; // Check permission before any actions

    const token = sessionStorage.getItem("jwtToken");

    // Get the highest role of the user from the token
    function getHighestRole(scopes) {
        const roles = scopes ? scopes.split(" ") : [];
        const rolePriority = {
            ROLE_ADMIN: 1,
            ROLE_STAFF: 2,
            ROLE_USER: 3,
        };

        // Filter valid roles and sort by priority
        const validRoles = roles.filter(role => rolePriority[role]);
        validRoles.sort((a, b) => rolePriority[a] - rolePriority[b]);

        return validRoles[0] || null; // Return highest priority role
    }

    // Service functions to interact with API
    this.getColors = function(page) {
        return $http.get(`http://localhost:8080/api/colors/list`, {
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
$scope.itemsPerPage = 5;  // Số lượng item mỗi trang
$scope.pages = [];

// Fetch color data without pagination from API
$scope.getColors = function() {
    colorService.getColors().then(function(response) {
        // Lấy toàn bộ dữ liệu
        $scope.colors = response.data;
        
        // Tính toán tổng số trang
        $scope.totalPages = Math.ceil($scope.colors.length / $scope.itemsPerPage);
        $scope.pages = new Array($scope.totalPages);
        
        // Chuyển đến trang đầu tiên
        $scope.goToPage($scope.currentPage);
    });
};

// Navigate to a specific page
$scope.goToPage = function(page) {
    if (page >= 0 && page < $scope.totalPages) {
        $scope.currentPage = page;
        
        // Tính toán chỉ mục của các item hiện tại trên trang
        let startIndex = $scope.currentPage * $scope.itemsPerPage;
        let endIndex = startIndex + $scope.itemsPerPage;
        
        // Cập nhật danh sách màu sắc hiện tại cho trang này
        $scope.currentPageItems = $scope.colors.slice(startIndex, endIndex);
    }
};

    
    // Initialize colors
    
    $scope.viewColorDetail = function(id) {
        colorService.getColorDetail(id).then(function(response) {
            $scope.color = response.data;
            $('#viewColorDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    // Open modal for adding a new color
    $scope.openAddColorModal = function() {
        $scope.newColor = {};
    };

    // Check duplicate name
    $scope.isDuplicateName = function(nameColor) {
        return $scope.colors.some(function(color) {
            return color.nameColor.toLowerCase() === nameColor.toLowerCase();
        });
    };

    // Check duplicate code
    $scope.isDuplicateCode = function(codeColor) {
        return $scope.colors.some(function(color) {
            return color.codeColor.toLowerCase() === codeColor.toLowerCase();
        });
    };
    $scope.saveNewColor = function() {
        // Kiểm tra xem mã màu có được chọn hay không
        if (!$scope.newColor.codeColor || $scope.newColor.codeColor.trim() === "") {
            alert("Vui lòng chọn mã màu!");
            return;
        }
    
        // Remove '#' if it exists in the color code
        if ($scope.newColor.codeColor.startsWith('#')) {
            $scope.newColor.codeColor = $scope.newColor.codeColor.substring(1);
        }
    
        // Kiểm tra tên màu sắc không quá 250 ký tự
        if ($scope.newColor.nameColor.length > 250) {
            alert("Tên màu sắc không được quá 250 ký tự!");
            return;
        }
    // Kiểm tra tên màu sắc không chứa số
    const containsNumberRegex = /[0-9]/;  // Kiểm tra chứa số
    if (containsNumberRegex.test($scope.newColor.nameColor)) {
        alert("Tên màu sắc không được chứa số!");
        return;
    }

        // Kiểm tra tên màu sắc không chứa ký tự đặc biệt
        const specialCharRegex =  /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;  // Kiểm tra ký tự đặc biệt
        if (specialCharRegex.test($scope.newColor.nameColor)) {
            alert("Tên màu sắc không được chứa ký tự đặc biệt!");
            return;
        }
    
        
        // Kiểm tra trùng tên
        if ($scope.colors.some(function(color) {
            return color.nameColor.toLowerCase() === $scope.newColor.nameColor.toLowerCase();
        })) {
            alert("Tên màu sắc đã tồn tại!");
            return;
        }
    
        // Kiểm tra trùng mã
        if ($scope.colors.some(function(color) {
            return color.codeColor.toLowerCase() === $scope.newColor.codeColor.toLowerCase();
        })) {
            alert("Mã màu sắc đã tồn tại!");
            return;
        }
    
        // Thêm màu mới nếu không có lỗi
        colorService.addColor($scope.newColor).then(function(response) {
            $scope.getColors();
            $('#addColorModal').modal('hide');
            location.reload();
        });
    };
    
    // Edit a color
    $scope.editColor = function(color) {
        $scope.color = angular.copy(color);
        console.log($scope.color);  // Kiểm tra xem color.id có được sao chép đúng không

        $('#editColorModal').modal('show');
    };

    $scope.saveEditColor = function() {
        // Remove '#' if it exists in the color code
        if ($scope.color.codeColor.startsWith('#')) {
            $scope.color.codeColor = $scope.color.codeColor.substring(1);
        }
    
        // Kiểm tra tên màu sắc không quá 250 ký tự
        if ($scope.color.nameColor.length > 250) {
            alert("Tên màu sắc không được quá 250 ký tự!");
            return;
        }
    
        // Kiểm tra tên màu sắc không chứa ký tự đặc biệt
        const specialCharRegex = /[^\w\s]/;  // Kiểm tra ký tự đặc biệt
        if (specialCharRegex.test($scope.color.nameColor)) {
            alert("Tên màu sắc không được chứa ký tự đặc biệt!");
            return;
        }
    
        // Kiểm tra tên màu sắc không chứa số
        const containsNumberRegex = /\d/;  // Kiểm tra chứa số
        if (containsNumberRegex.test($scope.color.nameColor)) {
            alert("Tên màu sắc không được chứa số!");
            return;
        }
    
        // Kiểm tra trùng tên (ngoại trừ màu sắc hiện tại)
        if ($scope.colors.some(function(color) {
            return color.nameColor.toLowerCase() === $scope.color.nameColor.toLowerCase() && color.id !== $scope.color.id;
        })) {
            alert("Tên màu sắc đã tồn tại!");
            return;
        }
    
        // Kiểm tra trùng mã màu (ngoại trừ mã hiện tại)
        if ($scope.colors.some(function(color) {
            return color.codeColor.toLowerCase() === $scope.color.codeColor.toLowerCase() && color.id !== $scope.color.id;
        })) {
            alert("Mã màu sắc đã tồn tại!");
            return;
        }
    
        // Cập nhật màu sắc nếu không có lỗi
        colorService.updateColor($scope.color.id, $scope.color).then(function(response) {
            $scope.getColors();
            $('#editColorModal').modal('hide');
            location.reload();
        });
    };
    
    
    
    // Delete a color
    $scope.deleteColor = function(codeColor) {
        $scope.colorToDelete = codeColor;
        $('#confirmDeleteModal').modal('show');

    };

    // Confirm color deletion
    $scope.confirmDeleteColor = function() {
        colorService.deleteColor($scope.colorToDelete).then(function(response) {
            $scope.getColors();
            $('#confirmDeleteModal').modal('hide');

            location.reload();
        });
    };

    // Initialize the color list
    $scope.getColors();

}]);

