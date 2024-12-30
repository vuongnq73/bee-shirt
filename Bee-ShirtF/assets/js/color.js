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

    // Fetch color data
    $scope.getColors = function(page) {
        colorService.getColors(page).then(function(response) {
            $scope.colors = response.data.content.map(function(item) {
                return {
                    id: item[0],
                    codeColor: item[1],
                    nameColor: item[2],
                    statusColor: item[3],
                };
            });
            $scope.totalPages = response.data.totalPages;
            $scope.pages = new Array($scope.totalPages);
        });
    };

    $scope.sortOrder = 'asc';  // Sorting order: 'asc' (ascending) or 'desc' (descending)

    // Sorting function
    $scope.sortColor = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.colors = $scope.colors.sort(function(a, b) {
                return a[field].localeCompare(b[field]);
            });
            $scope.sortOrder = 'desc';
        } else {
            $scope.colors = $scope.colors.sort(function(a, b) {
                return b[field].localeCompare(a[field]);
            });
            $scope.sortOrder = 'asc';
        }
    };

    // Navigate to a specific page
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.currentPage = page;
            $scope.getColors($scope.currentPage);
        }
    };

    // View color details
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
    $scope.containsSpecialCharacters = function(value) {
        const specialCharRegex = /[^a-zA-Z0-9\s]/; // Chỉ cho phép chữ, số, và khoảng trắng
        return specialCharRegex.test(value);
    };
    

    $scope.saveNewColor = function() {
        // Remove '#' if it exists in the color code
        if ($scope.newColor.codeColor.startsWith('#')) {
            $scope.newColor.codeColor = $scope.newColor.codeColor.substring(1);
        }
    
        // Check for special characters in name
        if ($scope.containsSpecialCharacters($scope.newColor.nameColor)) {
            alert("Tên màu sắc không được chứa ký tự đặc biệt!");
            return;
        }
    
        // Check for special characters in code
        if ($scope.containsSpecialCharacters($scope.newColor.codeColor)) {
            alert("Mã màu sắc không được chứa ký tự đặc biệt!");
            return;
        }
    
        // Check for duplicate name
        if ($scope.isDuplicateName($scope.newColor.nameColor)) {
            alert("Tên màu sắc đã tồn tại!");
            return;
        }
    
        // Check for duplicate code
        if ($scope.isDuplicateCode($scope.newColor.codeColor)) {
            alert("Mã màu sắc đã tồn tại!");
            return;
        }
    
        // Add new color if no duplicates
        colorService.addColor($scope.newColor).then(function(response) {
            $scope.getColors($scope.currentPage);
            $('#addColorModal').modal('hide');
            location.reload();
        });
    };
    

    // Edit a color
    $scope.editColor = function(color) {
        $scope.color = angular.copy(color);
        $('#editColorModal').modal('show');
    };

    // Save edited color
    $scope.saveEditColor = function() {
        // Remove '#' if it exists in the color code
        if ($scope.color.codeColor.startsWith('#')) {
            $scope.color.codeColor = $scope.color.codeColor.substring(1);
        }
    
        // Check for special characters in name
        if ($scope.containsSpecialCharacters($scope.color.nameColor)) {
            alert("Tên màu sắc không được chứa ký tự đặc biệt!");
            return;
        }
    
        // Check for special characters in code
        if ($scope.containsSpecialCharacters($scope.color.codeColor)) {
            alert("Mã màu sắc không được chứa ký tự đặc biệt!");
            return;
        }
    
        // Check for duplicate name (exclude current color)
        if ($scope.colors.some(function(color) {
            return color.nameColor.toLowerCase() === $scope.color.nameColor.toLowerCase() && color.id !== $scope.color.id;
        })) {
            alert("Tên màu sắc đã tồn tại!");
            return;
        }
    
        // Check for duplicate code (exclude current color)
        if ($scope.colors.some(function(color) {
            return color.codeColor.toLowerCase() === $scope.color.codeColor.toLowerCase() && color.id !== $scope.color.id;
        })) {
            alert("Mã màu sắc đã tồn tại!");
            return;
        }
    
        // Update color if no duplicates
        colorService.updateColor($scope.color.id, $scope.color).then(function(response) {
            $scope.getColors($scope.currentPage);
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
            $scope.getColors($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
            location.reload();
        });
    };

    // Initialize the color list
    $scope.getColors($scope.currentPage);
}]);
