
var app = angular.module('beeShirtDetail', []);

app.service('shirtDetailService', ['$http', function($http) {
    const baseUrl = 'http://localhost:8080/shirt-details';

    this.getShirtDetails = function() {
        return $http.get(baseUrl + '/api/hienthi');
    };

    this.addShirtDetail = function(shirtdetail) {
        return $http.post(baseUrl + '/add', shirtdetail);
    };

    this.updateShirtDetail = function(codeShirtDetail, shirtdetail) {
        return $http.put(baseUrl + '/update/' + codeShirtDetail, shirtdetail);
    };

    this.deleteShirtDetail = function(codeshirtdetail) {
        return $http.delete(baseUrl + '/delete/' + codeshirtdetail);
    };

    this.getColors = function() {
        return $http.get(baseUrl + '/api/colors');
    };

    this.getGenders = function() {
        return $http.get(baseUrl + '/api/genders');
    };

    this.getMaterials = function() {
        return $http.get(baseUrl + '/api/materials');
    };

    this.getOrigins = function() {
        return $http.get(baseUrl + '/api/origins');
    };

    this.getPatterns = function() {
        return $http.get(baseUrl + '/api/patterns');
    };

    this.getSeasons = function() {
        return $http.get(baseUrl + '/api/seasons');
    };

    this.getSizes = function() {
        return $http.get(baseUrl + '/api/sizes');
    };
    this.getShirts = function() {
        return $http.get(baseUrl + '/api/shirts');
    };
}]);

app.controller('ShirtDetailController', ['$scope', 'shirtDetailService', function($scope, shirtDetailService) {
    $scope.shirtDetails = [];
    $scope.colors = [];
    $scope.genders = [];
    $scope.materials = [];
    $scope.origins = [];
    $scope.patterns = [];
    $scope.seasons = [];
    $scope.sizes = [];
    $scope.shirts = [];

    $scope.editingShirtDetail = null; // Để lưu thông tin áo thun đang được chỉnh sửa
    $scope.newShirtDetail = {};
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    $scope.getShirtDetailsForCurrentPage = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const endIndex = startIndex + $scope.itemsPerPage;
        return $scope.shirtDetails.slice(startIndex, endIndex);
    };

    $scope.getShirtDetails = function() {
        shirtDetailService.getShirtDetails().then(function(response) {
            $scope.shirtDetails = response.data;
            $scope.currentPage = 1;
        });
    };

    $scope.addShirtDetail = function() {
        shirtDetailService.addShirtDetail($scope.newShirtDetail).then(function() {
            $scope.getShirtDetails();
            $scope.newShirtDetail = {};
        });
    };

    $scope.editShirtDetail = function(shirtDetail) {
        $scope.newShirtDetail = angular.copy(shirtDetail);
    };

    $scope.deleteShirtDetail = function(codeShirtDetail) {
        shirtDetailService.deleteShirtDetail(codeShirtDetail).then(function() {
            $scope.getShirtDetails();
        });
    };

    $scope.getColors = function() {
        shirtDetailService.getColors().then(function(response) {
            $scope.colors = response.data;
        });
    };

    $scope.getGenders = function() {
        shirtDetailService.getGenders().then(function(response) {
            $scope.genders = response.data;
        });
    };

    $scope.getMaterials = function() {
        shirtDetailService.getMaterials().then(function(response) {
            $scope.materials = response.data;
        });
    };

    $scope.getOrigins = function() {
        shirtDetailService.getOrigins().then(function(response) {
            $scope.origins = response.data;
        });
    };

    $scope.getPatterns = function() {
        shirtDetailService.getPatterns().then(function(response) {
            $scope.patterns = response.data;
        });
    };

    $scope.getSeasons = function() {
        shirtDetailService.getSeasons().then(function(response) {
            $scope.seasons = response.data;
        });
    };

    $scope.getSizes = function() {
        shirtDetailService.getSizes().then(function(response) {
            $scope.sizes = response.data;
        });
    };
    $scope.getShirts = function() {
        shirtDetailService.getShirts().then(function(response) {
            $scope.shirts = response.data;
        });
    };
        $scope.editShirtDetail = function(shirtdetail) {
    // Sao chép đối tượng chi tiết áo thun để tránh thay đổi trực tiếp
        $scope.editingShirtDetail = angular.copy(shirtdetail);

        //chuyển dữ liệu các dropdown thuộc tính
        $scope.editingShirtDetail.colorId=$scope.editingShirtDetail.color.id;
        $scope.editingShirtDetail.genderId=$scope.editingShirtDetail.gender.id;
        $scope.editingShirtDetail.materialId=$scope.editingShirtDetail.material.id;
        $scope.editingShirtDetail.originId=$scope.editingShirtDetail.origin.id;
        $scope.editingShirtDetail.shirtId=$scope.editingShirtDetail.shirt.id;
        $scope.editingShirtDetail.patternId=$scope.editingShirtDetail.pattern.id;
        $scope.editingShirtDetail.seasonId=$scope.editingShirtDetail.season.id;
        $scope.editingShirtDetail.sizeId=$scope.editingShirtDetail.size.id;

        //các trạng thái status, deleted
        $scope.editingShirtDetail.statusshirtdetail=$scope.editingShirtDetail.statusshirtdetail;
        $scope.editingShirtDetail.deleted=$scope.editingShirtDetail.deleted;
    };


    $scope.updateShirtDetail = function() {
    // Sao chép dữ liệu từ đối tượng editShirtDetail
        let updateShirtDetailed = angular.copy($scope.editingShirtDetail);

        // Chuyển các ID thuộc tính thành đối tượng
        updateShirtDetailed.color = { id: updateShirtDetailed.colorId };
        updateShirtDetailed.gender = { id: updateShirtDetailed.genderId };
        updateShirtDetailed.material = { id: updateShirtDetailed.materialId };
        updateShirtDetailed.origin = { id: updateShirtDetailed.originId };
        updateShirtDetailed.shirt = { id: updateShirtDetailed.shirtId };
        updateShirtDetailed.pattern = { id: updateShirtDetailed.patternId };
        updateShirtDetailed.season = { id: updateShirtDetailed.seasonId };
        updateShirtDetailed.size = { id: updateShirtDetailed.sizeId };

        // Cập nhật trạng thái và đã xóa

        // Gửi yêu cầu cập nhật chi tiết áo thun
        shirtDetailService.updateShirtDetail(updateShirtDetailed.codeShirtDetail, updateShirtDetailed).then(function() {

        $scope.editingShirtDetail = null;
        $scope.getShirtDetails();

        }, function(error) {
        console.error("Error updating shirt", error);
    });
    };


    $scope.deleteShirtDetail = function(codeShirtDetail) {
        console.log("Deleting shirt detail with code:", codeShirtDetail); // Debugging
        if (confirm('Bạn có chắc chắn muốn xóa áo này không?')) {
            shirtDetailService.deleteShirtDetail(codeShirtDetail).then(function() {
                $scope.getShirtDetails();
            }).catch(function(error) {
                alert('Có lỗi xảy ra khi xóa áo thun: ' + error.message);
            });
        }
    };
    // Initial data fetch
    $scope.getShirtDetails();
    $scope.getColors();
    $scope.getGenders();
    $scope.getMaterials();
    $scope.getPatterns();
    $scope.getSeasons();
    $scope.getOrigins();

    $scope.getSizes();
    $scope.getShirts();

}]);