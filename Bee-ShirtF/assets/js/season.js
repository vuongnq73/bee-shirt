var app = angular.module('SeasonApp', []);
app.service('seasonService', ['$http', function($http) {
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

    this.getSeasons = function() {
        return $http.get('http://localhost:8080/api/seasons/list', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getSeasonDetail = function(codeSeason) {
        return $http.get(`http://localhost:8080/api/seasons/detail/${codeSeason}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.addSeason = function(season) {
        return $http.post('http://localhost:8080/api/seasons/add', season, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.updateSeason = function(codeSeason, season) {
        return $http.put(`http://localhost:8080/api/seasons/update/${codeSeason}`, season, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteSeason = function(codeSeason) {
        return $http.put(`http://localhost:8080/api/seasons/delete/${codeSeason}`, {}, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);
app.controller('seasonController', ['$scope', 'seasonService', function($scope, seasonService) {
    $scope.season = {};
    $scope.newSeason = {};
    $scope.confirmDelete = false;
    $scope.seasonToDelete = null;

    // Thêm các biến lọc và tìm kiếm
    $scope.statusFilter = ''; // Trạng thái lọc (0 hoặc 1)
    $scope.searchText = '';   // Chuỗi tìm kiếm theo tên mùa
    $scope.itemsPerPage = 5;  // Số phần tử mỗi trang
    $scope.totalPages = 0;    // Tổng số trang
    $scope.currentPage = 0;   // Trang hiện tại
    $scope.pages = [];        // Dãy số trang

    $scope.filterByStatus = function(status) {
        $scope.statusFilter = status; // Cập nhật trạng thái lọc
        $scope.getSeasons(); // Gọi lại getSeasons để lọc và cập nhật mùa
    };
    
    $scope.getSeasons = function() {
        seasonService.getSeasons().then(function(response) {
            $scope.seasons = response.data;  // Lấy tất cả mùa từ API
    
            // Lọc theo trạng thái nếu có filter
            $scope.filteredSeasons = $scope.seasons.filter(function(season) {
                if ($scope.statusFilter !== '') {
                    return season.statusSeason === parseInt($scope.statusFilter, 10);
                }
                return true;  // Nếu không có filter, hiển thị tất cả
            });
    
            // Tìm kiếm theo tên nếu có
            if ($scope.searchText) {
                $scope.filteredSeasons = $scope.filteredSeasons.filter(function(season) {
                    return season.nameSeason.toLowerCase().includes($scope.searchText.toLowerCase());
                });
            }
    
            // Tính tổng số trang dựa trên filteredSeasons
            $scope.totalPages = Math.ceil($scope.filteredSeasons.length / $scope.itemsPerPage);
    
            // Gọi hàm phân trang với trang đầu tiên sau khi lọc
            $scope.paginate(0);
        });
    };
    
    $scope.paginate = function(page) {
        $scope.currentPage = page;
    
        // Sử dụng filteredSeasons thay vì seasons để phân trang
        const dataToPaginate = $scope.filteredSeasons || $scope.seasons; // Dùng filteredSeasons nếu có, nếu không dùng tất cả seasons
    
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
    
    
    $scope.searchSeason = function() {
        if ($scope.searchText) {
            // Tìm kiếm theo tên hoặc mã
            $scope.currentPageItems = $scope.seasons.filter(function(season) {
                return season.nameSeason.toLowerCase().includes($scope.searchText.toLowerCase()) || 
                       season.codeSeason.toLowerCase().includes($scope.searchText.toLowerCase());
            });
    
            // Tính lại tổng số trang sau khi tìm kiếm
            $scope.totalPages = Math.ceil($scope.currentPageItems.length / $scope.itemsPerPage);
            $scope.paginate($scope.currentPage);
        } else {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả mùa
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
    $scope.sortSeasons = function(field) {
        if ($scope.sortOrder === 'asc') {
            $scope.seasons = $scope.seasons.sort(function(a, b) {
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
            $scope.seasons = $scope.seasons.sort(function(a, b) {
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
    $scope.viewSeasonDetail = function(codeSeason) {
        seasonService.getSeasonDetail(codeSeason).then(function(response) {
            $scope.season = response.data;
            $('#viewSeasonDetailModal').modal('show');
        });
    };

    // Close modal function
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddSeasonModal = function() {
        $scope.newSeason = {};
    };

    $scope.editSeason = function(season) {
        $scope.season = angular.copy(season);
        $('#editSeasonModal').modal('show');
    };

    $scope.saveNewSeason = function() {
        const seasonName = $scope.newSeason.nameSeason;
        const seasonCode = $scope.newSeason.codeSeason;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!seasonName || seasonName.trim() === "") {
            alert("Tên mùa không được để trống!");
            return;
        }
        // Kiểm tra độ dài tên
        if (seasonName.length > 250) {
            alert("Tên mùa không được quá 250 ký tự!");
            return;
        }
        // Kiểm tra tên không chỉ chứa khoảng trắng
        const trimmedName = seasonName.trim();
        if (trimmedName.length === 0) {
            alert("Tên mùa không được chỉ chứa khoảng trắng!");
            return;
        }
        // Kiểm tra không chứa số hoặc ký tự đặc biệt
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(trimmedName)) {
            alert("Tên mùa không được chứa số hoặc ký tự đặc biệt!");
            return;
        }
    
        // Kiểm tra trùng mã và tên
        const isDuplicate = $scope.seasons.some(function(item) {
            return item.nameSeason.toLowerCase() === seasonName.toLowerCase() || item.codeSeason === seasonCode;
        });
    
        if (isDuplicate) {
            alert("Tên mùa hoặc mã mùa này đã tồn tại!");
            return; // Dừng lại nếu trùng mã hoặc tên
        }
    
        seasonService.addSeason($scope.newSeason).then(function(response) {
            alert("Thêm mùa thành công!");
            $('#addSeasonModal').modal('hide');
            $scope.getSeasons(); // Cập nhật danh sách mùa sau khi thêm
            location.reload();
        }).catch(function(error) {
            alert("Lỗi khi thêm mùa!");
        });
    };
    

    $scope.saveEditSeason = function() {
        const seasonName = $scope.season.nameSeason;
    
        // Kiểm tra nếu tên trống hoặc chỉ chứa khoảng trắng
        if (!seasonName || seasonName.trim() === "") {
            alert("Tên mùa không được để trống!");
            return;
        }
        // Kiểm tra độ dài tên
        if (seasonName.length > 250) {
            alert("Tên mùa không được quá 250 ký tự!");
            return;
        }
        // Kiểm tra không chứa số hoặc ký tự đặc biệt
        const specialCharAndNumberRegex = /[0-9@#$%^&*()_+={}[\]:;"'<>,.?/\\|~`!]/;
        if (specialCharAndNumberRegex.test(seasonName.trim())) {
            alert("Tên mùa không được chứa số hoặc ký tự đặc biệt!");
            return;
        }
    
        // Kiểm tra trùng tên (loại trừ chính mùa hiện tại)
        const isDuplicateName = $scope.seasons.some(function(item) {
            return item.nameSeason.toLowerCase() === seasonName.toLowerCase() && item.codeSeason !== $scope.season.codeSeason;
        });
    
        if (isDuplicateName) {
            alert("Tên mùa này đã tồn tại!");
            return; // Dừng lại nếu trùng tên
        }
    
        seasonService.updateSeason($scope.season.codeSeason, $scope.season).then(function(response) {
            alert("Cập nhật mùa thành công!");
            $('#editSeasonModal').modal('hide');
            $scope.getSeasons(); // Cập nhật danh sách mùa sau khi sửa
            location.reload();
        }).catch(function(error) {
            alert("Lỗi khi cập nhật mùa!");
        });
    };
    
    $scope.deleteSeason = function() {
        if (!$scope.seasonToDelete) {
            alert("Không có mùa để xóa.");
            return;
        }

        seasonService.deleteSeason($scope.seasonToDelete.codeSeason).then(function(response) {
            alert("Xóa mùa thành công!");
            $scope.getSeasons();
            $scope.confirmDelete = false;
        }).catch(function(error) {
            alert("Lỗi khi xóa mùa!");
        });
    };

    // Lấy danh sách mùa ngay khi trang được tải
    $scope.getSeasons();
}]);
