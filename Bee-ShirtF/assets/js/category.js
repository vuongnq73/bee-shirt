var app = angular.module('CategoryApp', []);
app.service('categoryService', ['$http', function($http) {
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

    this.getCategories = function(page) {
        return $http.get(`http://localhost:8080/api/categories/list?page=${page}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getCategoryDetail = function(codeCategory) {
        return $http.get(`http://localhost:8080/api/categories/detail/${codeCategory}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addCategory = function(category) {
        return $http.post('http://localhost:8080/api/categories/add', category, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateCategory = function(codeCategory, category) {
        return $http.put(`http://localhost:8080/api/categories/update/${codeCategory}`, category, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteCategory = function(codeCategory) {
        return $http.put(`http://localhost:8080/api/categories/delete/${codeCategory}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('categoryController', ['$scope', 'categoryService', function($scope, categoryService) {
    $scope.categories = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.category = {};
    $scope.newCategory = {};
    $scope.confirmDelete = false;
    $scope.categoryToDelete = null;

    $scope.getCategories = function(page) {
        categoryService.getCategories(page).then(function(response) {
            $scope.categories = response.data.content.map(function(item) {
                return {
                    codeCategory: item[0],
                    nameCategory: item[1],
                    statusCategory: item[2]
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
            $scope.getCategories($scope.currentPage);
        }
    };

    $scope.viewCategoryDetail = function(codeCategory) {
        categoryService.getCategoryDetail(codeCategory).then(function(response) {
            $scope.category = response.data;
            $('#viewCategoryDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddCategoryModal = function() {
        $scope.newCategory = {};
    };

    $scope.saveNewCategory = function() {
        categoryService.addCategory($scope.newCategory).then(function(response) {
            $scope.getCategories($scope.currentPage);
            $('#addCategoryModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editCategory = function(category) {
        $scope.category = angular.copy(category);
        $('#editCategoryModal').modal('show');
    };

    $scope.saveEditCategory = function() {
        categoryService.updateCategory($scope.category.codeCategory, $scope.category).then(function(response) {
            $scope.getCategories($scope.currentPage);
            $('#editCategoryModal').modal('hide');
        });
    };

    $scope.deleteCategory = function(codeCategory) {
        $scope.categoryToDelete = codeCategory;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteCategory = function() {
        categoryService.deleteCategory($scope.categoryToDelete).then(function(response) {
            $scope.getCategories($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getCategories($scope.currentPage);
}]);
