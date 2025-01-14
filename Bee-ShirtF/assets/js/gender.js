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

    this.getGenders = function() {
        return $http.get('http://localhost:8080/api/genders/list', {
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
        return $http.put(`http://localhost:8080/api/genders/delete/${codeGender}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('genderController', ['$scope', 'genderService', function($scope, genderService) {
    $scope.gender = {};
    $scope.newGender = {};
    $scope.confirmDelete = false;
    $scope.genderToDelete = null;

    // Thêm các biến lọc và tìm kiếm
    $scope.statusFilter = ''; // Trạng thái lọc (0 hoặc 1)
    $scope.searchText = '';   // Chuỗi tìm kiếm theo tên gender
    $scope.itemsPerPage = 5;  // Số phần tử mỗi trang
    $scope.totalPages = 0;    // Tổng số trang
    $scope.currentPage = 0;   // Trang hiện tại
    $scope.pages = [];        // Dãy số trang

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status; // Cập nhật trạng thái lọc
        $scope.getGenders(); // Gọi lại getGenders để lọc và cập nhật gender
    };

    $scope.getGenders = function() {
        genderService.getGenders().then(function(response) {
            $scope.genders = response.data;  // Lấy tất cả gender từ API

            // Lọc theo trạng thái nếu có filter
            $scope.filteredGenders = $scope.genders.filter(function(gender) {
                if ($scope.statusFilter !== '') {
                    return gender.statusGender === parseInt($scope.statusFilter, 10);
                }
                return true;  // Nếu không có filter, hiển thị tất cả
            });

            // Tìm kiếm theo tên nếu có
            if ($scope.searchText) {
                $scope.filteredGenders = $scope.filteredGenders.filter(function(gender) {
                    return gender.nameGender.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }

            // Tính tổng số trang dựa trên filteredGenders
            $scope.totalPages = Math.ceil($scope.filteredGenders.length / $scope.itemsPerPage);

            // Gọi hàm phân trang với trang đầu tiên sau khi lọc
            $scope.paginate(0);
        });
    };

    $scope.paginate = function(page) {
        $scope.currentPage = page;

        // Sử dụng filteredGenders thay vì genders để phân trang
        const dataToPaginate = $scope.filteredGenders || $scope.genders; // Dùng filteredGenders nếu có, nếu không dùng tất cả genders

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

    // Các hàm tìm kiếm
    $scope.searchGender = function() {
        if ($scope.searchText) {
            // Tìm kiếm theo tên hoặc mã
            $scope.currentPageItems = $scope.genders.filter(function(gender) {
                return gender.nameGender.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       gender.codeGender.toLowerCase().includes($scope.searchText.toLowerCase());
            });

            // Tính lại tổng số trang sau khi tìm kiếm
            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả genders
            $scope.paginate($scope.currentPage);
        }
    };

    // Chuyển đến trang được chọn
    $scope.goToPage = function(page) {
        if (page >= 0 && page < $scope.totalPages) {
            $scope.paginate(page);
        }
    };

    // Sắp xếp
    $scope.sortOrder = $scope.sortOrder === 'asc' ? 'desc' : 'asc';

    $scope.sortGenders = function(field) {
        if ($scope.sortOrder === 'asc') {
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

    // Các hàm khác không thay đổi
    $scope.viewGenderDetail = function(codeGender) {
        genderService.getGenderDetail(codeGender).then(function(response) {
            $scope.gender = response.data;
            $('#viewGenderDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddGenderModal = function() {
        $scope.newGender = {};
    };

    $scope.editGender = function(gender) {
        $scope.gender = angular.copy(gender);
        $('#editGenderModal').modal('show');
    };

    $scope.saveNewColor = function() {
        const colorName = $scope.newColor.nameColor;
        const colorCode = $scope.newColor.codeColor;
    
        // Kiểm tra nếu tên màu trống hoặc chỉ chứa khoảng trắng
        if (!colorName || colorName.trim() === "") {
            alert("Tên màu không được để trống!");
            return;
        }
    
        // Kiểm tra độ dài tên màu
        if (colorName.length > 250) {
            alert("Tên màu không được quá 250 ký tự!");
            return;
        }
    
        // Kiểm tra tên màu không chỉ chứa khoảng trắng
        const trimmedName = colorName.trim();
        if (trimmedName.length === 0) {
            alert("Tên màu không được chỉ chứa khoảng trắng!");
            return;
        }
    
        // Kiểm tra nếu tên màu chứa số
        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên màu không được chứa số!");
            return;
        }
    
        // Kiểm tra nếu tên màu chứa ký tự đặc biệt
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(trimmedName)) {
            alert("Tên màu không được chứa ký tự đặc biệt!");
            return;
        }
    
        // Kiểm tra không trùng tên màu
        if ($scope.colors.some(c => c.nameColor === colorName)) {
            alert("Tên màu này đã tồn tại!");
            return;
        }
    
        // Kiểm tra nếu mã màu trống hoặc chỉ chứa khoảng trắng
        if (!colorCode || colorCode.trim() === "") {
            alert("Mã màu không được để trống!");
            return;
        }
    
        // Kiểm tra độ dài mã màu
        if (colorCode.length > 50) {
            alert("Mã màu không được quá 50 ký tự!");
            return;
        }
    
        // Kiểm tra không trùng mã màu
        if ($scope.colors.some(c => c.codeColor === colorCode)) {
            alert("Mã màu này đã tồn tại!");
            return;
        }
    
        // Thêm màu mới nếu hợp lệ
        colorService.addColor($scope.newColor).then(function() {
            alert("Thêm màu thành công!");
            $('#addColorModal').modal('hide');
            $scope.getColors();
        }).catch(function() {
            alert("Có lỗi xảy ra khi thêm màu.");
        });
    };
    
    $scope.saveEditGender = function() {
        const genderName = $scope.gender.nameGender;

        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!genderName || genderName.trim() === "") {
            alert("Tên gender không được để trống!");
            return;
        }

        // Kiểm tra độ dài tên
        if (genderName.length > 250) {
            alert("Tên gender không được quá 250 ký tự!");
            return;
        }

        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = genderName.trim();
        if (trimmedName.length === 0) {
            alert("Tên gender không được chỉ chứa khoảng trắng!");
            return;
        }

        const containsNumberRegex = /[0-9]/;
        if (containsNumberRegex.test(trimmedName)) {
            alert("Tên gender không được chứa số!");
            return;
        }

        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
            if (specialCharAndNumberRegex.test(trimmedName)) {
                alert("Tên danh mục không được chứa ký tự đặc biệt!");
                return;
            }

        genderService.updateGender($scope.gender.codeGender, $scope.gender).then(function() {
            alert("Cập nhật gender thành công!");
            $('#editGenderModal').modal('hide');
            $scope.getGenders();
        }).catch(function() {
            alert("Có lỗi xảy ra khi cập nhật gender.");
        });
    };

    $scope.deleteGender = function(codeGender) {
        $scope.genderToDelete = codeGender;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteGender = function() {
        genderService.deleteGender($scope.genderToDelete).then(function() {
            alert("Xóa gender thành công!");
            $scope.getGenders();
        }).catch(function() {
            alert("Có lỗi xảy ra khi xóa gender.");
        });

        // Đóng modal xác nhận
        $('#confirmDeleteModal').modal('hide');
    };

    // Gọi hàm getGenders để tải dữ liệu khi trang tải xong
    $scope.getGenders();
}]);
