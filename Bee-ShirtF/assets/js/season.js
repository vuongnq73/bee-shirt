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

    this.getSeasons = function(page) {
        return $http.get(`http://localhost:8080/api/seasons/list?page=${page}`, {
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
        return $http.put(`http://localhost:8080/api/seasons/delete/${codeSeason}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
}]);
app.controller('seasonController', ['$scope', 'seasonService', function($scope, seasonService) {
    $scope.seasons = [];
    $scope.currentPage = 0;
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.season = {};
    $scope.newSeason = {};
    $scope.confirmDelete = false;
    $scope.seasonToDelete = null;

    $scope.getSeasons = function(page) {
        seasonService.getSeasons(page).then(function(response) {
            $scope.seasons = response.data.content.map(function(item) {
                return {
                    codeSeason: item[0],
                    nameSeason: item[1],
                    statusSeason: item[2]
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
            $scope.getSeasons($scope.currentPage);
        }
    };

    $scope.viewSeasonDetail = function(codeSeason) {
        seasonService.getSeasonDetail(codeSeason).then(function(response) {
            $scope.season = response.data;
            $('#viewSeasonDetailModal').modal('show');
        });
    };

    // Đóng modal
    $scope.closeModal = function(modalId) {
        $(`#${modalId}`).modal('hide');
    };

    $scope.openAddSeasonModal = function() {
        $scope.newSeason = {};
    };

    $scope.saveNewSeason = function() {
        seasonService.addSeason($scope.newSeason).then(function(response) {
            $scope.getSeasons($scope.currentPage);
            $('#addSeasonModal').modal('hide');
            location.reload(); 
        });
    };

    $scope.editSeason = function(season) {
        $scope.season = angular.copy(season);
        $('#editSeasonModal').modal('show');
    };

    $scope.saveEditSeason = function() {
        seasonService.updateSeason($scope.season.codeSeason, $scope.season).then(function(response) {
            $scope.getSeasons($scope.currentPage);
            $('#editSeasonModal').modal('hide');
        });
    };

    $scope.deleteSeason = function(codeSeason) {
        $scope.seasonToDelete = codeSeason;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmDeleteSeason = function() {
        seasonService.deleteSeason($scope.seasonToDelete).then(function(response) {
            $scope.getSeasons($scope.currentPage);
            $('#confirmDeleteModal').modal('hide');
        });
    };

    $scope.getSeasons($scope.currentPage);
}]);
