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

    this.getPatterns = function() {
        return $http.get('http://localhost:8080/api/patterns/list', {
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
        return $http.put(`http://localhost:8080/api/patterns/delete/${codePattern}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);
app.controller('patternController', ['$scope', 'patternService', function($scope, patternService) {
    $scope.pattern = {};
    $scope.newPattern = {};
    $scope.confirmDelete = false;
    $scope.patternToDelete = null;

    // Thêm các biến lọc và tìm kiếm
    $scope.statusFilter = ''; // Trạng thái lọc (0 hoặc 1)
    $scope.searchText = '';   // Chuỗi tìm kiếm theo tên mẫu
    $scope.itemsPerPage = 5;  // Số phần tử mỗi trang
    $scope.totalPages = 0;    // Tổng số trang
    $scope.currentPage = 0;   // Trang hiện tại
    $scope.pages = [];        // Dãy số trang

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status; // Cập nhật trạng thái lọc
        $scope.getPatterns(); // Gọi lại getPatterns để lọc và cập nhật mẫu
    };
    
    $scope.getPatterns = function() {
        patternService.getPatterns().then(function(response) {
            $scope.patterns = response.data;  // Lấy tất cả mẫu từ API
    
            // Lọc theo trạng thái nếu có filter
            $scope.filteredPatterns = $scope.patterns.filter(function(pattern) {
                if ($scope.statusFilter !== '') {
                    return pattern.statusPattern === parseInt($scope.statusFilter, 10);
                }
                return true;  // Nếu không có filter, hiển thị tất cả
            });
    
            // Tìm kiếm theo tên nếu có
            if ($scope.searchText) {
                $scope.filteredPatterns = $scope.filteredPatterns.filter(function(pattern) {
                    return pattern.namePattern.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }
    
            // Tính tổng số trang dựa trên filteredPatterns
            $scope.totalPages = Math.ceil($scope.filteredPatterns.length / $scope.itemsPerPage);
    
            // Gọi hàm phân trang với trang đầu tiên sau khi lọc
            $scope.paginate(0);
        });
    };
    
    $scope.paginate = function(page) {
        $scope.currentPage = page;
    
        // Sử dụng filteredPatterns thay vì patterns để phân trang
        const dataToPaginate = $scope.filteredPatterns || $scope.patterns; // Dùng filteredPatterns nếu có, nếu không dùng tất cả patterns
    
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
    
    
    $scope.searchPattern = function() {
        if ($scope.searchText) {
            // Tìm kiếm theo tên hoặc mã
            $scope.currentPageItems = $scope.patterns.filter(function(pattern) {
                return pattern.namePattern.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       pattern.codePattern.toLowerCase().includes($scope.searchText.toLowerCase());
            });
    
            // Tính lại tổng số trang sau khi tìm kiếm
            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả mẫu
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
    $scope.sortPatterns = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.patterns = $scope.patterns.sort(function(a, b) {
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
            $scope.patterns = $scope.patterns.sort(function(a, b) {
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
    $scope.viewPatternDetail = function(codePattern) {
        patternService.getPatternDetail(codePattern).then(function(response) {
            $scope.pattern = response.data;
            $('#viewPatternDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddPatternModal = function() {
        $scope.newPattern = {};
    };

    $scope.editPattern = function(pattern) {
        $scope.pattern = angular.copy(pattern);
        $('#editPatternModal').modal('show');
    };

    $scope.saveNewPattern = function() {
        const patternName = $scope.newPattern.namePattern;
        const patternCode = $scope.newPattern.codePattern;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!patternName || patternName.trim() === "") {
            alert("Tên mẫu không được để trống!");
            return;
        }
        // Kiểm tra độ dài tên
        if (patternName.length > 250) {
            alert("Tên mẫu không được quá 250 ký tự!");
            return;
        }
    
        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = patternName.trim();
        if (trimmedName.length === 0) {
            alert("Tên mẫu không được chỉ chứa khoảng trắng!");
            return;
        }
        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên mẫu không được chứa số!");
            return;
        }

        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa ký tự đặc biệt!");
                return;
            }
    
        // Kiểm tra trùng tên và mã khi thêm
        let isDuplicate = $scope.patterns.some(function(item) {
            return item.namePattern.toLowerCase() === patternName.toLowerCase() || item.codePattern === patternCode;
        });
    
        if (isDuplicate) {
            alert("Tên mẫu hoặc mã mẫu này đã tồn tại!");
            return; // Dừng lại nếu tên hoặc mã đã tồn tại
        }
    
        if (confirm("Bạn có chắc chắn muốn thêm mẫu áo này?")) {
            patternService.addPattern($scope.newPattern).then(function(response) {
                alert("Thêm mẫu thành công!");
                $scope.getPatterns($scope.currentPage);
                $('#addPatternModal').modal('hide');
                location.reload();
            }, function(error) {
                alert("Có lỗi xảy ra khi thêm mẫu.");
            });
        }
    };
    
    $scope.saveEditPattern = function() {
        const patternName = $scope.pattern.namePattern;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!patternName || patternName.trim() === "") {
            alert("Tên mẫu không được để trống!");
            return;
        }
        // Kiểm tra độ dài tên
        if (patternName.length > 250) {
            alert("Tên mẫu không được quá 250 ký tự!");
            return;
        }
        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = patternName.trim();
        if (trimmedName.length === 0) {
            alert("Tên mẫu không được chỉ chứa khoảng trắng!");
            return;
        }
        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên mẫu không được chứa số!");
            return;
        }
    
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên mẫu áo không được chứa ký tự đặc biệt!");
                return;
            }

        // Khi sửa, không cần kiểm tra mã, chỉ kiểm tra tên
        let isDuplicate = $scope.patterns.some(function(item) {
            return item.namePattern.toLowerCase() === patternName.toLowerCase() && item.codePattern !== $scope.pattern.codePattern;
        });
    
        if (isDuplicate) {
            alert("Tên mẫu này đã tồn tại!");
            return; // Dừng lại nếu tên đã tồn tại
        }
    
        patternService.updatePattern($scope.pattern).then(function(response) {
            alert("Cập nhật mẫu thành công!");
            $scope.getPatterns();
            $('#editPatternModal').modal('hide');
        }, function(error) {
            alert("Có lỗi xảy ra khi cập nhật mẫu.");
        });
    };

    $scope.deletePattern = function(pattern) {
        $scope.patternToDelete = pattern;
        $scope.confirmDelete = true;
    };

    $scope.confirmDeletePattern = function() {
        if ($scope.patternToDelete) {
            patternService.deletePattern($scope.patternToDelete.codePattern).then(function(response) {
                alert("Mẫu đã được xóa.");
                $scope.getPatterns();
                $scope.confirmDelete = false;
                $scope.patternToDelete = null;
            }, function(error) {
                alert("Có lỗi xảy ra khi xóa mẫu.");
            });
        }
    };

    $scope.cancelDeletePattern = function() {
        $scope.confirmDelete = false;
        $scope.patternToDelete = null;
    };

    $scope.getPatterns();
}]);
