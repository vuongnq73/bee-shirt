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

    const token = sessionStorage.getItem("jwtToken");

    this.getSizes = function() {
        return $http.get('http://localhost:8080/api/sizes/list', {
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
        return $http.put(`http://localhost:8080/api/sizes/delete/${codeSize}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('sizeController', ['$scope', 'sizeService', function($scope, sizeService) {
    $scope.size = {};
    $scope.newSize = {};
    $scope.confirmDelete = false;
    $scope.sizeToDelete = null;

    // Thêm các biến lọc và tìm kiếm
    $scope.statusFilter = ''; // Trạng thái lọc (0 hoặc 1)
    $scope.searchText = '';   // Chuỗi tìm kiếm theo tên kích thước
    $scope.itemsPerPage = 5;  // Số phần tử mỗi trang
    $scope.totalPages = 0;    // Tổng số trang
    $scope.currentPage = 0;   // Trang hiện tại
    $scope.pages = [];        // Dãy số trang

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status; // Cập nhật trạng thái lọc
        $scope.getSizes(); // Gọi lại getSizes để lọc và cập nhật kích thước
    };
    
    $scope.getSizes = function() {
        sizeService.getSizes().then(function(response) {
            $scope.sizes = response.data;  // Lấy tất cả kích thước từ API
    
            // Lọc theo trạng thái nếu có filter
            $scope.filteredSizes = $scope.sizes.filter(function(size) {
                if ($scope.statusFilter !== '') {
                    return size.statusSize === parseInt($scope.statusFilter, 10);
                }
                return true;  // Nếu không có filter, hiển thị tất cả
            });
    
            // Tìm kiếm theo tên nếu có
            if ($scope.searchText) {
                $scope.filteredSizes = $scope.filteredSizes.filter(function(size) {
                    return size.namesize.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }
    
            // Tính tổng số trang dựa trên filteredSizes
            $scope.totalPages = Math.ceil($scope.filteredSizes.length / $scope.itemsPerPage);
    
            // Gọi hàm phân trang với trang đầu tiên sau khi lọc
            $scope.paginate(0);
        });
    };
    
    $scope.paginate = function(page) {
        $scope.currentPage = page;
    
        // Sử dụng filteredSizes thay vì sizes để phân trang
        const dataToPaginate = $scope.filteredSizes || $scope.sizes; // Dùng filteredSizes nếu có, nếu không dùng tất cả sizes
    
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
    
    $scope.searchSize = function() {
        if ($scope.searchText) {
            // Tìm kiếm theo tên hoặc mã
            $scope.currentPageItems = $scope.sizes.filter(function(size) {
                return size.namesize.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       size.codeSize.toLowerCase().includes($scope.searchText.toLowerCase());
            });
    
            // Tính lại tổng số trang sau khi tìm kiếm
            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả kích thước
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
    $scope.sortSizes = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.sizes = $scope.sizes.sort(function(a, b) {
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
            $scope.sizes = $scope.sizes.sort(function(a, b) {
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
    $scope.viewSizeDetail = function(codeSize) {
        sizeService.getSizeDetail(codeSize).then(function(response) {
            $scope.size = response.data;
            $('#viewSizeDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddSizeModal = function() {
        $scope.newSize = {};
    };

    $scope.editSize = function(size) {
        $scope.size = angular.copy(size);
        $('#editSizeModal').modal('show');
    };

    $scope.saveNewSize = function() {
        const sizeName = $scope.newSize.namesize;
        const sizeCode = $scope.newSize.codeSize;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!sizeName || sizeName.trim() === "") {
            alert("Tên kích thước không được để trống!");
            return;
        }
        // Kiểm tra độ dài tên
        if (sizeName.length > 250) {
            alert("Tên kích thước không được quá 250 ký tự!");
            return;
        }
        // Kiểm tra không chỉ chứa khoảng trắng
        const trimmedName = sizeName.trim();
        if (trimmedName.length === 0) {
            alert("Tên kích thước không được chỉ chứa khoảng trắng!");
            return;
        }
        // Kiểm tra không chứa số hoặc ký tự đặc biệt
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(trimmedName)) {
            alert("Tên kích thước không được chứa số hoặc ký tự đặc biệt!");
            return;
        }
    
        // Kiểm tra trùng mã hoặc tên
        const isDuplicate = $scope.sizes.some(function(item) {
            return item.namesize.toLowerCase() === sizeName.toLowerCase() || item.codeSize === sizeCode;
        });
    
        if (isDuplicate) {
            alert("Tên kích thước hoặc mã kích thước này đã tồn tại!");
            return;
        }
    
        sizeService.addSize($scope.newSize).then(function(response) {
            alert("Thêm kích thước thành công!");
            $scope.getSizes(); // Cập nhật danh sách kích thước
            $('#addSizeModal').modal('hide');
        }, function(error) {
            alert("Có lỗi xảy ra khi thêm kích thước.");
        });
    };
    $scope.saveEditSize = function() {
        const sizeName = $scope.size.namesize;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!sizeName || sizeName.trim() === "") {
            alert("Tên kích thước không được để trống!");
            return;
        }
        // Kiểm tra độ dài tên
        if (sizeName.length > 250) {
            alert("Tên kích thước không được quá 250 ký tự!");
            return;
        }
        // Kiểm tra không chỉ chứa khoảng trắng
        const trimmedName = sizeName.trim();
        if (trimmedName.length === 0) {
            alert("Tên kích thước không được chỉ chứa khoảng trắng!");
            return;
        }
        // Kiểm tra không chứa số hoặc ký tự đặc biệt
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(trimmedName)) {
            alert("Tên kích thước không được chứa số hoặc ký tự đặc biệt!");
            return;
        }
    
        // Kiểm tra trùng tên (bỏ qua chính kích thước hiện tại)
        const isDuplicate = $scope.sizes.some(function(item) {
            return item.namesize.toLowerCase() === sizeName.toLowerCase() && item.codeSize !== $scope.size.codeSize;
        });
    
        if (isDuplicate) {
            alert("Tên kích thước này đã tồn tại!");
            return;
        }
    
        if (confirm("Bạn có chắc chắn muốn sửa kích thước này?")) {
            sizeService.updateSize($scope.size.codeSize, $scope.size).then(function(response) {
                alert("Sửa kích thước thành công!");
                $scope.getSizes($scope.currentPage); // Cập nhật danh sách kích thước
                $('#editSizeModal').modal('hide');
            }, function(error) {
                alert("Có lỗi xảy ra khi sửa kích thước.");
            });
        }
    };
        
    $scope.deleteSize = function(codeSize) {
        if (confirm("Bạn có chắc chắn muốn xóa kích thước này?")) {
            sizeService.deleteSize(codeSize).then(function(response) {
                alert("Xóa kích thước thành công!");
                $scope.getSizes();
            }, function(error) {
                alert("Có lỗi xảy ra khi xóa kích thước.");
            });
        }
    };
    
    $scope.getSizes();  // Khởi tạo và lấy danh sách kích thước ngay khi trang tải
}]);
