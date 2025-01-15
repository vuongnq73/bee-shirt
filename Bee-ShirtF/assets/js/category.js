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
this.getCategories = function() {
    return $http.get('http://localhost:8080/api/categories/list', {
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
        return $http.put(`http://localhost:8080/api/categories/delete/${codeCategory}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
    
}]);
app.controller('categoryController', ['$scope', 'categoryService', function($scope, categoryService) {
    $scope.category = {};
    $scope.newCategory = {};
    $scope.confirmDelete = false;
    $scope.categoryToDelete = null;

    // Thêm các biến lọc và tìm kiếm
    $scope.statusFilter = ''; // Trạng thái lọc (0 hoặc 1)
    $scope.searchText = '';   // Chuỗi tìm kiếm theo tên danh mục
    $scope.itemsPerPage = 5;  // Số phần tử mỗi trang
    $scope.totalPages = 0;    // Tổng số trang
    $scope.currentPage = 0;   // Trang hiện tại
    $scope.pages = [];        // Dãy số trang

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status; // Cập nhật trạng thái lọc
        $scope.getCategories(); // Gọi lại getCategories để lọc và cập nhật danh mục
    };
    
    $scope.getCategories = function() {
        categoryService.getCategories().then(function(response) {
            $scope.categories = response.data;  // Lấy tất cả danh mục từ API
    
            // Lọc theo trạng thái nếu có filter
            $scope.filteredCategories = $scope.categories.filter(function(category) {
                if ($scope.statusFilter !== '') {
                    return category.statusCategory === parseInt($scope.statusFilter, 10);
                }
                return true;  // Nếu không có filter, hiển thị tất cả
            });
    
            // Tìm kiếm theo tên nếu có
            if ($scope.searchText) {
                $scope.filteredCategories = $scope.filteredCategories.filter(function(category) {
                    return category.nameCategory.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }
    
            // Tính tổng số trang dựa trên filteredCategories
            $scope.totalPages = Math.ceil($scope.filteredCategories.length / $scope.itemsPerPage);
    
            // Gọi hàm phân trang với trang đầu tiên sau khi lọc
            $scope.paginate(0);
        });
    };
    
    $scope.paginate = function(page) {
        $scope.currentPage = page;
    
        // Sử dụng filteredCategories thay vì categories để phân trang
        const dataToPaginate = $scope.filteredCategories || $scope.categories; // Dùng filteredCategories nếu có, nếu không dùng tất cả categories
    
        // Tính toán vị trí bắt đầu và kết thúc của các phần tử cho trang hiện tại
        const start = page * $scope.itemsPerPage;
        const end = start + $scope.itemsPerPage;
    
        // Cập nhật lại danh sách phần tử cho trang hiện tại
        $scope.currentPageItems = dataToPaginate.slice(start, end);
    
        // Cập nhật dãy số trang
        $scope.pages = [];
        for (let i = 0; i < $scope.totalPages; i++) {
            $scope.pages.push(i + 1); // Tạo dãy số trang (1, 2, 3, ...)
        }
    };
    
    
    $scope.searchCategory = function() {
        if ($scope.searchText) {
            // Tìm kiếm theo tên hoặc mã
            $scope.currentPageItems = $scope.categories.filter(function(category) {
                return category.nameCategory.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       category.codeCategory.toLowerCase().includes($scope.searchText.toLowerCase());
            });
    
            // Tính lại tổng số trang sau khi tìm kiếm
            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả danh mục
            $scope.paginate($scope.currentPage);
        }
    };
    
        

    // Chuyển đến trang được chọn
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.paginate(page);
        }
    };





    // Các hàm khác như trước
    $scope.sortOrder = $scope.sortOrder === 'asc' ? 'desc' : 'asc';

    // Hàm sắp xếp
    $scope.sortCategories = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.categories = $scope.categories.sort(function(a, b) {
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
            $scope.categories = $scope.categories.sort(function(a, b) {
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

    // Các hàm khác không thay đổi
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

    $scope.editCategory = function(category) {
        $scope.category = angular.copy(category);
        $('#editCategoryModal').modal('show');
    };


    $scope.saveNewCategory = function() {
        const categoryName = $scope.newCategory.nameCategory;
        const categoryCode = $scope.newCategory.codeCategory;
    
       // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
       if (!categoryName || categoryName.trim() === "") {
        alert("Tên danh mục không được để trống!");
        return;
        }
        // Kiểm tra độ dài tên
        if (categoryName.length > 250) {
            alert("Tên danh mục không được quá 250 ký tự!");
            return;
        }
            // Kiểm tra tên không chỉ chứa khoảng trắng
            const trimmedName = categoryName.trim();
            if (trimmedName.length === 0) {
                alert("Tên danh mục không được chỉ chứa khoảng trắng!");
                return;
            }
            const containsNumberRegex = /[0-9]/;
            if (containsNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa số!");
                return;
            }

            const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa ký tự đặc biệt!");
                return;
            }

    
        // Kiểm tra trùng tên và mã khi thêm
        let isDuplicate = $scope.categories.some(function(item) {
            return item.nameCategory.toLowerCase() === categoryName.toLowerCase() || item.codeCategory === categoryCode;
        });
    
        if (isDuplicate) {
            alert("Tên danh mục hoặc mã danh mục này đã tồn tại!");
            return; // Dừng lại nếu tên hoặc mã đã tồn tại
        }
    
        if (confirm("Bạn có chắc chắn muốn thêm danh mục này?")) {
            categoryService.addCategory($scope.newCategory).then(function(response) {
                alert("Thêm danh mục thành công!");
                $scope.getCategories($scope.currentPage);
                $('#addCategoryModal').modal('hide');
                location.reload();
            }, function(error) {
                alert("Có lỗi xảy ra khi thêm danh mục.");
            });
        }
    };
    
    $scope.saveEditCategory = function() {
        const categoryName = $scope.category.nameCategory;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!categoryName || categoryName.trim() === "") {
            alert("Tên danh mục không được để trống!");
            return;
        }
     // Kiểm tra độ dài tên
     if (categoryName.length > 250) {
        alert("Tên danh mục không được quá 250 ký tự!");
        return;
    }
        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = categoryName.trim();
        if (trimmedName.length === 0) {
            alert("Tên danh mục không được chỉ chứa khoảng trắng!");
            return;
        }
        const containsNumberRegex = /[0-9]/;
            if (containsNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa số!");
                return;
            }

            const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa ký tự đặc biệt!");
                return;
            }
        // Khi sửa, không cần kiểm tra mã, chỉ kiểm tra tên
        let isDuplicate = $scope.categories.some(function(item) {
            return item.nameCategory.toLowerCase() === categoryName.toLowerCase() && item.codeCategory !== $scope.category.codeCategory;
        });
    
        if (isDuplicate) {
            alert("Tên danh mục này đã tồn tại!");
            return; // Dừng lại nếu tên đã tồn tại với danh mục khác
        }
        console.log($scope.category); // Kiểm tra xem status có tồn tại trong đối tượng này không

        if (confirm("Bạn có chắc chắn muốn sửa danh mục này?")) {
            categoryService.updateCategory($scope.category.codeCategory, $scope.category).then(function(response) {
                alert("Cập nhật danh mục thành công!");
                $scope.getCategories($scope.currentPage);
                $('#editCategoryModal').modal('hide');
                location.reload();
            }, function(error) {
                alert("Có lỗi xảy ra khi cập nhật danh mục.");
            });
        }
    };
    
    
    $scope.deleteCategory = function(codeCategory) {
        $scope.categoryToDelete = codeCategory;
        if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            categoryService.deleteCategory($scope.categoryToDelete).then(function(response) {
                alert("Xóa danh mục thành công!");
                $scope.getCategories($scope.currentPage);  // Cập nhật lại danh sách sau khi xóa thành công
            }, function(error) {
                alert("Có lỗi xảy ra khi xóa danh mục.");
            });
        }
    };
    
    

    // Load categories initially
    $scope.getCategories();
}]);

