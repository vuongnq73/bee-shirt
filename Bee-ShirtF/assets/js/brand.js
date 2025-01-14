var app = angular.module('BrandApp', []);
app.service('brandService', ['$http', function($http) {
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

    this.getBrands = function() {
        return $http.get('http://localhost:8080/api/brands/list', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getBrandDetail = function(codeBrand) {
        return $http.get(`http://localhost:8080/api/brands/detail/${codeBrand}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addBrand = function(brand) {
        return $http.post('http://localhost:8080/api/brands/add', brand, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateBrand = function(codeBrand, brand) {
        return $http.put(`http://localhost:8080/api/brands/update/${codeBrand}`, brand, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteBrand = function(codeBrand) {
        return $http.put(`http://localhost:8080/api/brands/delete/${codeBrand}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);

app.controller('brandController', ['$scope', 'brandService', function($scope, brandService) {
    $scope.brand = {};
    $scope.newBrand = {};
    $scope.confirmDelete = false;
    $scope.brandToDelete = null;

    // Thêm các biến lọc và tìm kiếm
    $scope.statusFilter = ''; // Trạng thái lọc (0 hoặc 1)
    $scope.searchText = '';   // Chuỗi tìm kiếm theo tên brand
    $scope.itemsPerPage = 5;  // Số phần tử mỗi trang
    $scope.totalPages = 0;    // Tổng số trang
    $scope.currentPage = 0;   // Trang hiện tại
    $scope.pages = [];        // Dãy số trang

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status; // Cập nhật trạng thái lọc
        $scope.getBrands(); // Gọi lại getBrands để lọc và cập nhật brand
    };

    $scope.getBrands = function() {
        brandService.getBrands().then(function(response) {
            $scope.brands = response.data;  // Lấy tất cả brand từ API

            // Lọc theo trạng thái nếu có filter
            $scope.filteredBrands = $scope.brands.filter(function(brand) {
                if ($scope.statusFilter !== '') {
                    return brand.statusBrand === parseInt($scope.statusFilter, 10);
                }
                return true;  // Nếu không có filter, hiển thị tất cả
            });

            // Tìm kiếm theo tên nếu có
            if ($scope.searchText) {
                $scope.filteredBrands = $scope.filteredBrands.filter(function(brand) {
                    return brand.nameBrand.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }

            // Tính tổng số trang dựa trên filteredBrands
            $scope.totalPages = Math.ceil($scope.filteredBrands.length / $scope.itemsPerPage);

            // Gọi hàm phân trang với trang đầu tiên sau khi lọc
            $scope.paginate(0);
        });
    };

    $scope.paginate = function(page) {
        $scope.currentPage = page;

        // Sử dụng filteredBrands thay vì brands để phân trang
        const dataToPaginate = $scope.filteredBrands || $scope.brands; // Dùng filteredBrands nếu có, nếu không dùng tất cả brands

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
    $scope.searchBrand = function() {
        if ($scope.searchText) {
            // Tìm kiếm theo tên hoặc mã
            $scope.currentPageItems = $scope.brands.filter(function(brand) {
                return brand.nameBrand.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       brand.codeBrand.toLowerCase().includes($scope.searchText.toLowerCase());
            });

            // Tính lại tổng số trang sau khi tìm kiếm
            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả brands
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

    $scope.sortBrands = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.brands = $scope.brands.sort(function(a, b) {
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
            $scope.brands = $scope.brands.sort(function(a, b) {
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
    $scope.viewBrandDetail = function(codeBrand) {
        brandService.getBrandDetail(codeBrand).then(function(response) {
            $scope.brand = response.data;
            $('#viewBrandDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddBrandModal = function() {
        $scope.newBrand = {};
    };

    $scope.editBrand = function(brand) {
        $scope.brand = angular.copy(brand);
        $('#editBrandModal').modal('show');
    };

    $scope.saveNewBrand = function() {
        const brandName = $scope.newBrand.nameBrand;
        const brandCode = $scope.newBrand.codeBrand;

        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!brandName || brandName.trim() === "") {
            alert("Tên brand không được để trống!");
            return;
        }

        // Kiểm tra độ dài tên
        if (brandName.length > 250) {
            alert("Tên brand không được quá 250 ký tự!");
            return;
        }

        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = brandName.trim();
        if (trimmedName.length === 0) {
            alert("Tên brand không được chỉ chứa khoảng trắng!");
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

        // Kiểm tra không trùng tên brand
        let isDuplicate = $scope.brands.some(function(item) {
            return item.nameBrand.toLowerCase() === brandName.toLowerCase();
        });

        if (isDuplicate) {
            alert("Tên brand này đã tồn tại!");
            return; // Dừng lại nếu tên đã tồn tại
        }

        // Kiểm tra nếu mã trống hoặc chỉ chứa khoảng trắng
        if (!brandCode || brandCode.trim() === "") {
            alert("Mã brand không được để trống!");
            return;
        }

        // Gọi API thêm brand
        brandService.addBrand($scope.newBrand).then(function(response) {
            alert("Thêm brand thành công!");
            $scope.getBrands();
            $('#addBrandModal').modal('hide');
        }, function(error) {
            alert("Có lỗi xảy ra khi thêm brand.");
        });
    };

    $scope.saveEditBrand = function() {
        const brandName = $scope.brand.nameBrand;
        const brandCode = $scope.brand.codeBrand;

        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!brandName || brandName.trim() === "") {
            alert("Tên brand không được để trống!");
            return;
        }

        // Kiểm tra độ dài tên
        if (brandName.length > 250) {
            alert("Tên brand không được quá 250 ký tự!");
            return;
        }

        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = brandName.trim();
        if (trimmedName.length === 0) {
            alert("Tên brand không được chỉ chứa khoảng trắng!");
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
        // Kiểm tra không trùng tên brand khi sửa
        let isDuplicate = $scope.brands.some(function(item) {
            return item.nameBrand.toLowerCase() === brandName.toLowerCase() && item.codeBrand !== $scope.brand.codeBrand;
        });

        if (isDuplicate) {
            alert("Tên brand này đã tồn tại!");
            return; // Dừng lại nếu tên đã tồn tại
        }

        if (confirm("Bạn có chắc chắn muốn sửa brand này?")) {
            brandService.updateBrand($scope.brand.codeBrand, $scope.brand).then(function(response) {
                alert("Sửa brand thành công!");
                $scope.getBrands($scope.currentPage);
                $('#editBrandModal').modal('hide');
                location.reload();
            }, function(error) {
                alert("Có lỗi xảy ra khi sửa brand.");
            });
        }
    };

    $scope.deleteBrand = function(codeBrand) {
        $scope.brandToDelete = codeBrand;
        $scope.confirmDelete = true;
    };

    $scope.confirmDeleteBrand = function() {
        if ($scope.brandToDelete) {
            brandService.deleteBrand($scope.brandToDelete).then(function(response) {
                alert("Xóa brand thành công!");
                $scope.getBrands($scope.currentPage);
                $scope.confirmDelete = false;
                $('#deleteBrandModal').modal('hide');
            }, function(error) {
                alert("Có lỗi xảy ra khi xóa brand.");
            });
        }
    };

    $scope.cancelDelete = function() {
        $scope.confirmDelete = false;
    };

    // Khởi tạo danh sách brand ban đầu
    $scope.getBrands();
}]);
