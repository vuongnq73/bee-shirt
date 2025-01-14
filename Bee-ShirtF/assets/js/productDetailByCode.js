
var app = angular.module('beeShirtDetail', []);
// Lấy giá trị tham số 'codeShirt' từ URL
const urlParams = new URLSearchParams(window.location.search);
const codeShirt = urlParams.get('codeShirt');

// In ra giá trị codeShirt
console.log(codeShirt);  // Kết quả: "S387821"

app.service('shirtDetailService', ['$http', function($http) {
    const baseUrl = 'http://localhost:8080/shirt-details';

    
    
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

// Hàm gọi API lấy tất cả chi tiết áo thun
this.getShirtDetails = function() {
    return $http.get(baseUrl + '/api/hienthi', {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
};

// Hàm gọi API lấy chi tiết áo thun theo mã
this.getShirtDetailsByCode = function() {
    return $http.get('http://localhost:8080/shirt-details/byCode/' + codeShirt, {
        headers: {
            Authorization: "Bearer " + token,
        }
    });
};

// Hàm kiểm tra và gọi API tương ứng
this.getShirtDetailsBasedOnCode = function() {
    
        return this.getShirtDetailsByCode(codeShirt);
   
};


    this.saveVariants = function(savedVariants) {
        return $http.post(baseUrl + '/add', savedVariants,{ headers: {
            Authorization: "Bearer " + token,
          },}); 
    };

    this.updateShirtDetail = function(codeShirtDetail, shirtdetail) {
        return $http.put(baseUrl + '/update/' + codeShirtDetail, shirtdetail, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.deleteShirtDetail = function(codeshirtdetail) {
        return $http.delete(baseUrl + '/delete/' + codeshirtdetail, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getColors = function() {
        return $http.get(baseUrl + '/api/colors', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getGenders = function() {
        return $http.get(baseUrl + '/api/genders', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getMaterials = function() {
        return $http.get(baseUrl + '/api/materials', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getOrigins = function() {
        return $http.get(baseUrl + '/api/origins', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getPatterns = function() {
        return $http.get(baseUrl + '/api/patterns', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getSeasons = function() {
        return $http.get(baseUrl + '/api/seasons', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };

    this.getSizes = function() {
        return $http.get(baseUrl + '/api/sizes', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
    this.getShirts2 = function() {
        return $http.get(baseUrl + '/api/shirt/byCode/'+codeShirt, {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
    };
    this.getShirts = function() {
        return $http.get(baseUrl + '/api/shirts', {
            headers: {
                Authorization: "Bearer " + token,
            }
        });
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
    $scope.selectedColors = [];
    $scope.selectedSizes = [];
    $scope.variants = [];
    $scope.savedVariants = [];

    $scope.editingShirtDetail = null; // Để lưu thông tin áo thun đang được chỉnh sửa
    $scope.newShirtDetail = {};
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    
    $scope.shirtDetails = []; // Dữ liệu chi tiết áo thun đã lọc
    $scope.originalShirtDetails = []; // Dữ liệu chi tiết áo thun gốc (dùng để lọc)
    $scope.filters = {
        codeShirt: '',
        colorId: '',
        materialId: '',
        sizeId: '',
        price: null
    };
            // Lọc dữ liệu
    $scope.filterShirtDetails = function() {
        $scope.shirtDetails = $scope.originalShirtDetails.filter(function(shirtDetail) {
            return $scope.applyFilters(shirtDetail);
        });
        $scope.currentPage = 1;  // Đặt lại trang về trang đầu tiên khi lọc
        $scope.calculateTotalPages();
    };
    $scope.applyFilters = function(shirtDetail) {
        var isMatch = true;
        
     // Kiểm tra tìm kiếm theo mã, tên sản phẩm và mã chi tiết
     if ($scope.filters.searchTerm) {
        var searchTerm = $scope.filters.searchTerm.toLowerCase();
        var codeShirtMatch = shirtDetail.codeShirt.toLowerCase().includes(searchTerm);
        var nameShirtMatch = shirtDetail.nameShirt.toLowerCase().includes(searchTerm);
        var codeShirtDetailMatch = shirtDetail.codeShirtDetail.toLowerCase().includes(searchTerm);

        if (!codeShirtMatch && !nameShirtMatch && !codeShirtDetailMatch) {
            isMatch = false;
        }
    }
       
        // Lọc màu
        if ($scope.filters.colorId && shirtDetail.colorId !== $scope.filters.colorId) {
            isMatch = false;
        }
    
        // lọc chất liệu
        if ($scope.filters.materialId && shirtDetail.materialId !== $scope.filters.materialId) {
            isMatch = false;
        }
    
        // lọc size
        if ($scope.filters.sizeId && shirtDetail.sizeId !== $scope.filters.sizeId) {
            isMatch = false;
        }
        // Lọc xuất xứ
        if ($scope.filters.originId && shirtDetail.originId !== $scope.filters.originId) {
            isMatch = false;
        }

        // Lọc theo mẫu áo
        if ($scope.filters.patternId && shirtDetail.patternId !== $scope.filters.patternId) {
            isMatch = false;
        }
        // Lọc theo mẫu áo
        if ($scope.filters.genderId && shirtDetail.genderId !== $scope.filters.genderId) {
            isMatch = false;
        }
        // Lọc theo mẫu áo
        if ($scope.filters.seasonId && shirtDetail.seasonId !== $scope.filters.seasonId) {
            isMatch = false;
        }
        // Kiểm tra giá trong phạm vi (nếu có)
        if ($scope.filters.priceFrom && shirtDetail.price < $scope.filters.priceFrom) {
            isMatch = false;
        }
        if ($scope.filters.priceTo && shirtDetail.price > $scope.filters.priceTo) {
            isMatch = false;
        }
        return isMatch;
    };
    // Hàm gọi API lấy danh sách chi tiết áo thun (tùy theo có codeShirt hay không)
    $scope.getShirtDetails = function() {
        shirtDetailService.getShirtDetailsBasedOnCode().then(function(response) {
            $scope.originalShirtDetails = response.data;
            $scope.filterShirtDetails(); // Lọc sau khi lấy dữ liệu
            console.log(response.data);
        }).catch(function(error) {
            console.error('Có lỗi xảy ra:', error);
        });
    };
    
    // Phân trang: Lấy danh sách chi tiết áo thun cho trang hiện tại
    $scope.getShirtDetailsForCurrentPage = function() {
        const startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        const endIndex = startIndex + $scope.itemsPerPage;
        return $scope.shirtDetails.slice(startIndex, endIndex);
    };
    
    // Tính số trang
    $scope.calculateTotalPages = function() {
        $scope.totalPages = Math.ceil($scope.shirtDetails.length / $scope.itemsPerPage);
    };
    
    // Hàm để tính số thứ tự (STT) cho mỗi mục trên trang hiện tại
    $scope.getShirtIndex = function(index) {
        return ($scope.currentPage - 1) * $scope.itemsPerPage + (index + 1);
    };
    
    // Hàm để tính số trang khi nhấn next/prev
    $scope.changePage = function(page) {
        if (page > 0 && page <= $scope.totalPages) {
            $scope.currentPage = page;
        }
    };
    
    // Hàm toggle để chọn màu sắc và kích cỡ
    $scope.toggleColorSelection = function(colorId) {
        var index = $scope.selectedColors.indexOf(colorId);
        if (index > -1) {
            $scope.selectedColors.splice(index, 1);
        } else {
            $scope.selectedColors.push(colorId);
        }
    };
    
    $scope.toggleSizeSelection = function(sizeId) {
        var index = $scope.selectedSizes.indexOf(sizeId);
        if (index > -1) {
            $scope.selectedSizes.splice(index, 1);
        } else {
            $scope.selectedSizes.push(sizeId);
        }
    };
    
   $scope.updateErrorState = function (field) {
        if (field === 'shirt' && $scope.newShirtDetail?.shirt?.id) {
            $scope.errors.shirt = false;
        }
        if (field === 'material' && $scope.newShirtDetail?.material?.id) {
            $scope.errors.material = false;
        }
        if (field === 'gender' && $scope.newShirtDetail?.gender?.id) {
            $scope.errors.gender = false;
        }
        if (field === 'pattern' && $scope.newShirtDetail?.pattern?.id) {
            $scope.errors.pattern = false;
        }
        if (field === 'season' && $scope.newShirtDetail?.season?.id) {
            $scope.errors.season = false;
        }
        if (field === 'origin' && $scope.newShirtDetail?.origin?.id) {
            $scope.errors.origin = false;
        }
        if (field === 'colors' && $scope.selectedColors?.length > 0) {
            $scope.errors.colors = false;
        }
        if (field === 'sizes' && $scope.selectedSizes?.length > 0) {
            $scope.errors.sizes = false;
        }
    };
    
    $scope.generateVariants = function() {
        // Khởi tạo đối tượng lỗi
        $scope.errors = {};
        let hasError = false;
    
        // Kiểm tra các combobox
        if (!$scope.newShirtDetail || !$scope.newShirtDetail.shirt || !$scope.newShirtDetail.shirt.id) {
            $scope.errors.shirt = "Bạn chưa chọn sản phẩm.";
            hasError = true;
        }
        if (!$scope.newShirtDetail.material || !$scope.newShirtDetail.material.id) {
            $scope.errors.material = "Bạn chưa chọn chất liệu.";
            hasError = true;
        }
        if (!$scope.newShirtDetail.gender || !$scope.newShirtDetail.gender.id) {
            $scope.errors.gender = "Bạn chưa chọn giới tính.";
            hasError = true;
        }
        if (!$scope.newShirtDetail.pattern || !$scope.newShirtDetail.pattern.id) {
            $scope.errors.pattern = "Bạn chưa chọn họa tiết.";
            hasError = true;
        }
        if (!$scope.newShirtDetail.season || !$scope.newShirtDetail.season.id) {
            $scope.errors.season = "Bạn chưa chọn mùa.";
            hasError = true;
        }
        if (!$scope.newShirtDetail.origin || !$scope.newShirtDetail.origin.id) {
            $scope.errors.origin = "Bạn chưa chọn xuất xứ.";
            hasError = true;
        }
    
        // Kiểm tra màu và kích thước
        if (!$scope.selectedColors || $scope.selectedColors.length === 0) {
            $scope.errors.colors = "Bạn chưa chọn màu.";
            hasError = true;
        }
        if (!$scope.selectedSizes || $scope.selectedSizes.length === 0) {
            $scope.errors.sizes = "Bạn chưa chọn kích thước.";
            hasError = true;
        }
    
        const price = $scope.newShirtDetail.price;
    
        // Kiểm tra giá trị giá
        if (price === undefined || price === null || price === '') {
            $scope.errors.price = "Giá không được để trống.";
            hasError = true;
        } else if (isNaN(price)) {
            $scope.errors.price = "Giá phải là một số nguyên.";
            hasError = true;
        } else if (price <= 0) {
            $scope.errors.price = "Giá phải lớn hơn 0.";
            hasError = true;
        } else if (!Number.isInteger(Number(price))) {
            $scope.errors.price = "Giá phải là số nguyên.";
            hasError = true;
        } else if (price > 999999999) {
            $scope.errors.price = "Giá không được vượt quá 999.999.999.";
            hasError = true;
        } else {
            // Định dạng giá trị thành tiền Việt
            $scope.newShirtDetail.priceFormatted = $scope.formatCurrency(price);
        }
        // Nếu có lỗi, dừng lại và không tạo biến thể
        if (hasError) {
            return;
        }
    
        // Nếu không có lỗi, tạo biến thể
        $scope.variants = [];
        angular.forEach($scope.selectedColors, function(colorId) {
            angular.forEach($scope.selectedSizes, function(sizeId) {
                $scope.variants.push({
                    colorId: colorId,
                    sizeId: sizeId,
                    quantity: $scope.newShirtDetail.quantity || 0, // Gán số lượng cho biến thể
                    image: $scope.newShirtDetail.image, // Gán ảnh cho biến thể
                    image2: $scope.newShirtDetail.image2, // Gán ảnh 2 cho biến thể
                    image3: $scope.newShirtDetail.image3 // Gán ảnh 3 cho biến thể
                });
            });
        });
    };
    
    $scope.loadShirtDetails = function(codeShirt) {
        // Gọi API để lấy chi tiết áo thun
        this.getShirtDetailsByCondition(codeShirt).then(function(response) {
            if (response.data && response.data.length > 0) {
                // Nếu có chi tiết sản phẩm trả về, gán giá trị vào modal
                $scope.shirtDetails = response.data;
    
                if (codeShirt) {
                    // Nếu có mã, tự động chọn sản phẩm theo mã
                    $scope.selectedShirt = response.data[0];  // Lấy chi tiết đầu tiên (hoặc có thể tùy chỉnh)
                }
            }
        }).catch(function(error) {
            console.log('Lỗi khi tải chi tiết áo thun:', error);
        });
        
        
    };
    $scope.fileNameChanged = function(files, index, imageIndex) {
        if (files && files.length > 0) {
            var file = files[0]; // Lấy tệp đầu tiên
            console.log('File được chọn:', file);
            console.log('Chỉ mục biến thể:', index);
            console.log('Chỉ số ảnh:', imageIndex);
    
            var reader = new FileReader();
            reader.onload = function(e) {
                $scope.$apply(function() {
                    // Lưu ảnh vào biến thể và hiển thị ảnh ngay
                    if (imageIndex === 1) {
                        $scope.variants[index].imagePreview = e.target.result;
                        $scope.variants[index].image = file.name;  // Chỉ lưu tên tệp
                    } else if (imageIndex === 2) {
                        $scope.variants[index].image2Preview = e.target.result;
                        $scope.variants[index].image2 = file.name;  // Chỉ lưu tên tệp
                    } else if (imageIndex === 3) {
                        $scope.variants[index].image3Preview = e.target.result;
                        $scope.variants[index].image3 = file.name;  // Chỉ lưu tên tệp
                    }
                });
            };
            reader.readAsDataURL(file);  // Đọc tệp dưới dạng base64 để hiển thị
        }
    };
    
    
    $scope.saveAllVariants = function() {
        var confirmation = confirm("Bạn có muốn thêm các biến thể này không?");
        if (confirmation) {
            // Khởi tạo đối tượng lỗi
            $scope.errors = {};
            let hasError = false;
    
            // Kiểm tra mỗi biến thể
            angular.forEach($scope.variants, function(variant) {
                // Kiểm tra số lượng
                if (variant.quantity <= 0 || variant.quantity > 999999999) {
                    $scope.errors.quantity = "Số lượng phải là một số nguyên và lớn hơn 0, nhỏ hơn 999999999.";
                    hasError = true;
                }
    
                // Kiểm tra ảnh chính
                if (!variant.image) {
                    $scope.errors.image = "Ảnh chính không được để trống.";
                    hasError = true;
                }
    
                // Kiểm tra ảnh 2
                if (!variant.image2) {
                    $scope.errors.image2 = "Ảnh 2 không được để trống.";
                    hasError = true;
                }
    
                // Kiểm tra ảnh 3
                if (!variant.image3) {
                    $scope.errors.image3 = "Ảnh 3 không được để trống.";
                    hasError = true;
                }
            });
    
            // Nếu có lỗi, không lưu và thông báo lỗi
            if (hasError) {
                return; // Dừng lại nếu có lỗi
            }
            angular.forEach($scope.variants, function(variant) {
                if (variant.quantity > 0) {
                    // Kiểm tra nếu biến thể đã tồn tại
                    var existingVariant = $scope.savedVariants.find(v => 
                        v.colorId === variant.colorId && v.sizeId === variant.sizeId
                    );
                    if (existingVariant) {
                        existingVariant.quantity = variant.quantity; // Cập nhật số lượng
                    } else {
                        // Thêm biến thể mới
                        $scope.savedVariants.push({
                            shirtId: $scope.newShirtDetail.shirt.id, // Gán ID sản phẩm đã chọn
                            colorId: variant.colorId,
                            sizeId: variant.sizeId,
                            quantity: variant.quantity,
                            materialId: $scope.newShirtDetail.material.id,
                            genderId: $scope.newShirtDetail.gender.id,
                            originId: $scope.newShirtDetail.origin.id,
                            patternId: $scope.newShirtDetail.pattern.id,
                            seasonId: $scope.newShirtDetail.season.id,
                            price: $scope.newShirtDetail.price,
                            image: variant.image || '',  // Lưu tên ảnh cho biến thể
                            image2: variant.image2 || '',  // Lưu tên ảnh2 cho biến thể
                            image3: variant.image3 || ''  // Lưu tên ảnh3 cho biến thể
                        });
                    }
                }
            });
            $scope.submitVariants(); // Gửi dữ liệu lên backend
        } else {
            console.log("Người dùng đã hủy hành động.");
        }
    };
    

    // Submit dữ liệu lên backend
    $scope.submitVariants = function() {
        console.log("Dữ liệu sẽ được gửi lên backend:", $scope.savedVariants); // Kiểm tra dữ liệu trước khi gửi
    
        shirtDetailService.saveVariants($scope.savedVariants).then(function(response) {
            // Xử lý sau khi gửi thành công
            alert("Biến thể đã được lưu vào danh sách thành công.");
            console.log("Biến thể đã được lưu thành công:", response.data);
            $('#addVariantModal').modal('hide');  // Đóng modal form nhập liệu
            $('#saveVariantsModal').modal('hide');
            location.reload(); // Tải lại toàn bộ trang
        }, function(error) {
            // Xử lý lỗi khi gửi
            console.error("Có lỗi khi lưu biến thể:", error);
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
    // Hàm gọi API lấy tất cả áo thun
$scope.getShirts = function() {
    shirtDetailService.getShirts().then(function(response) {
        $scope.shirts = response.data;
        console.log("Danh sách tất cả áo thun:", $scope.shirts);
    }, function(error) {
        console.error('Lỗi khi lấy danh sách áo thun:', error);
    });
};

// Hàm gọi API lấy thông tin áo thun theo mã codeShirt
$scope.getShirts2 = function() {
    shirtDetailService.getShirts2($scope.selectedCodeShirt).then(function(response) {
        // Lưu thông tin áo thun vào scope
        $scope.shirt = response.data;
        console.log("Thông tin áo thun:", $scope.shirt);

        // Gán thông tin áo vào newShirtDetail.shirt
        if ($scope.shirt) {
            $scope.newShirtDetail.shirt = {
                id: $scope.shirt.id,  // Lưu ID của áo
                nameshirt: $scope.shirt.nameshirt  // Hiển thị tên áo
            };
        }
    }, function(error) {
        console.error('Lỗi khi lấy thông tin áo thun:', error);
    });
};

// Lấy giá trị selectedCodeShirt từ URL và gọi getShirts2
const urlParams = new URLSearchParams(window.location.search);
$scope.selectedCodeShirt = urlParams.get('codeShirt');

$scope.updateImagePreview = function(element, imageNumber) {
    const file = element.files[0];  // Lấy tệp đã chọn
    if (file) {
        // Lấy tên tệp ảnh
        const fileName = file.name;

        // Lưu tên ảnh và đường dẫn tương đối vào cơ sở dữ liệu
        const imagePath = '/assets/img/' + fileName;  // Giữ lại đường dẫn bắt đầu từ assets/img/

        // Cập nhật tên ảnh vào đối tượng editingShirtDetail
        $scope.$apply(function() {
            switch (imageNumber) {
                case 1:
                    $scope.editingShirtDetail.image = imagePath;  // Lưu đường dẫn ảnh vào đối tượng
                    break;
                case 2:
                    $scope.editingShirtDetail.image2 = imagePath;  // Lưu đường dẫn ảnh vào đối tượng
                    break;
                case 3:
                    $scope.editingShirtDetail.image3 = imagePath;  // Lưu đường dẫn ảnh vào đối tượng
                    break;
            }
        });
    }
};


        
    $scope.editShirtDetail = function(shirtdetail) {
        // Sao chép đối tượng chi tiết áo thun để tránh thay đổi trực tiếp
        $scope.editingShirtDetail = angular.copy(shirtdetail);
        
        // Chuyển dữ liệu các dropdown thuộc tính
        $scope.editingShirtDetail.colorId = $scope.editingShirtDetail.color.id;
        $scope.editingShirtDetail.genderId = $scope.editingShirtDetail.gender.id;
        $scope.editingShirtDetail.materialId = $scope.editingShirtDetail.material.id;
        $scope.editingShirtDetail.originId = $scope.editingShirtDetail.origin.id;
        $scope.editingShirtDetail.shirtId = $scope.editingShirtDetail.shirt.id;
        $scope.editingShirtDetail.patternId = $scope.editingShirtDetail.pattern.id;
        $scope.editingShirtDetail.seasonId = $scope.editingShirtDetail.season.id;
        $scope.editingShirtDetail.sizeId = $scope.editingShirtDetail.size.id;
        
        // Các ảnh
        $scope.editingShirtDetail.image = $scope.editingShirtDetail.image;   // Ảnh 1
        $scope.editingShirtDetail.image2 = $scope.editingShirtDetail.image2; // Ảnh 2
        $scope.editingShirtDetail.image3 = $scope.editingShirtDetail.image3; // Ảnh 3
    
        // Trạng thái và đã xóa
        $scope.editingShirtDetail.statusshirtdetail = $scope.editingShirtDetail.statusshirtdetail;
        $scope.editingShirtDetail.deleted = $scope.editingShirtDetail.deleted;
    };
    
    $scope.editShirtDetail = function(shirtdetail) {
        // Sao chép đối tượng chi tiết áo thun để tránh thay đổi trực tiếp
        $scope.editingShirtDetail = angular.copy(shirtdetail);
        
        // Chuyển dữ liệu các dropdown thuộc tính
        $scope.editingShirtDetail.colorId = $scope.editingShirtDetail.color.id;
        $scope.editingShirtDetail.genderId = $scope.editingShirtDetail.gender.id;
        $scope.editingShirtDetail.materialId = $scope.editingShirtDetail.material.id;
        $scope.editingShirtDetail.originId = $scope.editingShirtDetail.origin.id;
        $scope.editingShirtDetail.shirtId = $scope.editingShirtDetail.shirt.id;
        $scope.editingShirtDetail.patternId = $scope.editingShirtDetail.pattern.id;
        $scope.editingShirtDetail.seasonId = $scope.editingShirtDetail.season.id;
        $scope.editingShirtDetail.sizeId = $scope.editingShirtDetail.size.id;
        
        // Các ảnh
        $scope.editingShirtDetail.image = $scope.editingShirtDetail.image;   // Ảnh 1
        $scope.editingShirtDetail.image2 = $scope.editingShirtDetail.image2; // Ảnh 2
        $scope.editingShirtDetail.image3 = $scope.editingShirtDetail.image3; // Ảnh 3
    
        // Trạng thái và đã xóa
        $scope.editingShirtDetail.statusshirtdetail = $scope.editingShirtDetail.statusshirtdetail;
        $scope.editingShirtDetail.deleted = $scope.editingShirtDetail.deleted;
    };
    
    $scope.updateShirtDetail = function() {
        // Xóa thông báo lỗi trước khi kiểm tra
        $scope.errorMessage = '';
    
        // Kiểm tra giá trị của giá
        if (!updateShirtDetailed.price) {
            $scope.errorMessage = "Vui lòng nhập giá.";
            return;
        } 
        // Giá phải là số và không có ký tự đặc biệt
        if (isNaN(updateShirtDetailed.price)) {
            $scope.errorMessage = "Giá phải là một số hợp lệ.";
            return;
        }
        // Giá phải lớn hơn 0
        if (updateShirtDetailed.price <= 0) {
            $scope.errorMessage = "Giá phải lớn hơn 0.";
            return;
        }
        // Giá không được vượt quá 999999999
        if (updateShirtDetailed.price > 999999999) {
            $scope.errorMessage = "Giá không được vượt quá 999999999.";
            return;
        }
    
        // Kiểm tra giá trị của số lượng
        if (!updateShirtDetailed.quantity) {
            $scope.errorMessage = "Vui lòng nhập số lượng.";
            return;
        }
        // Số lượng phải là số nguyên và không có ký tự đặc biệt
        if (!Number.isInteger(updateShirtDetailed.quantity)) {
            $scope.errorMessage = "Số lượng phải là một số nguyên hợp lệ.";
            return;
        }
        // Số lượng phải lớn hơn 0
        if (updateShirtDetailed.quantity <= 0) {
            $scope.errorMessage = "Số lượng phải lớn hơn 0.";
            return;
        }
        // Số lượng không được vượt quá 999999999
        if (updateShirtDetailed.quantity > 999999999) {
            $scope.errorMessage = "Số lượng không được vượt quá 999999999.";
            return;
        }
    
        // Kiểm tra ảnh (nếu có ảnh thì phải hợp lệ)
        if (updateShirtDetailed.image && !updateShirtDetailed.image.match(/\.(jpg|jpeg|png|gif)$/)) {
            $scope.errorMessage = "Vui lòng tải lên ảnh hợp lệ (JPEG, PNG, GIF).";
            return;
        }
         // Kiểm tra ảnh (nếu có ảnh thì phải hợp lệ)
         if (updateShirtDetailed.image2 && !updateShirtDetailed.image3.match(/\.(jpg|jpeg|png|gif)$/)) {
            $scope.errorMessage = "Vui lòng tải lên ảnh hợp lệ (JPEG, PNG, GIF).";
            return;
        }
         // Kiểm tra ảnh (nếu có ảnh thì phải hợp lệ)
         if (updateShirtDetailed.image2 && !updateShirtDetailed.image3.match(/\.(jpg|jpeg|png|gif)$/)) {
            $scope.errorMessage = "Vui lòng tải lên ảnh hợp lệ (JPEG, PNG, GIF).";
            return;
        }
    
        // Sao chép dữ liệu từ đối tượng editingShirtDetail
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
        updateShirtDetailed.statusshirtdetail = updateShirtDetailed.statusshirtdetail;
        updateShirtDetailed.deleted = updateShirtDetailed.deleted;
    
        // Gửi yêu cầu cập nhật chi tiết áo thun
        shirtDetailService.updateShirtDetail(updateShirtDetailed.codeShirtDetail, updateShirtDetailed).then(function() {
            // Sau khi cập nhật thành công, reset đối tượng đang sửa và tải lại danh sách
            $scope.editingShirtDetail = null;
            $scope.getShirtDetails();
        }, function(error) {
            console.error("Error updating shirt detail", error);
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
     // Hàm để lấy tên màu sắc theo ID
     $scope.getColorName = function(colorId) {
        var color = $scope.colors.find(c => c.id === colorId);
        return color ? color.nameColor : '';
    };

    // Hàm để lấy tên kích thước theo ID
    $scope.getSizeName = function(sizeId) {
        var size = $scope.sizes.find(s => s.id === sizeId);
        return size ? size.namesize : '';
    };
    // Hàm để lấy tên màu sắc theo ID
    $scope.getMaterialName = function(materialId) {
        var material = $scope.materials.find(m => m.id === materialId);
        return material ? material.nameMaterial : '';
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
    $scope.getShirts2();
    $scope.formatCurrency = function (value) {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    
    
}]);
app.directive('ngFiles', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeHandler = $parse(attrs.ngFiles);
            element.on('change', function(event) {
                scope.$apply(function() {
                    onChangeHandler(scope, { $files: event.target.files });
                });
            });
        }
    };
}]);
