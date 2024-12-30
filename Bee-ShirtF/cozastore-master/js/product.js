angular.module('app', [])

.controller('ShirtController', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
    // Lấy dữ liệu các thương hiệu và danh mục từ backend
    $http.get('http://localhost:8080/shirts/api/brands')
        .then(function(response) {
            $scope.brands = response.data;  // Dữ liệu về các thương hiệu
        })
        .catch(function(error) {
            console.log('Error:', error);
        });

    $http.get('http://localhost:8080/shirts/api/categories')
        .then(function(response) {
            $scope.categories = response.data;  // Dữ liệu về các danh mục
        })
        .catch(function(error) {
            console.log('Error:', error);
        });
        function checkPermission() {
            const token = sessionStorage.getItem("jwtToken");
            if (!token) {
                alert("Bạn chưa đăng nhập!");
                window.location.href = "/assets/account/login.html"; // Redirect to login page
                return false; // Stop if no token
            }
    
            // Decode the token and get the payload
            const payload = JSON.parse(atob(token.split(".")[1]));
            const roles = payload.scope ? payload.scope.split(" ") : [];
    
           
            return true; // Continue if has permission
        }
    
        if (!checkPermission()) return; // Check permission before any actions
    
        const token = sessionStorage.getItem("jwtToken");
    
        // Get the highest role of the user from the token
        function getHighestRole(scopes) {
            const roles = scopes ? scopes.split(" ") : [];
            const rolePriority = {
                ROLE_ADMIN: 1,
                ROLE_STAFF: 2,
                ROLE_USER: 3,
            };
    
            // Filter valid roles and sort by priority
            const validRoles = roles.filter(role => rolePriority[role]);
            validRoles.sort((a, b) => rolePriority[a] - rolePriority[b]);
    
            return validRoles[0] || null; // Return highest priority role
        }
    

    // Khởi tạo các biến cho modal và sản phẩm đã chọn
    $scope.isModalOpen = false;
    $scope.selectedShirt = null;
    
    // Lấy dữ liệu áo thun từ backend
    $http.get('http://localhost:8080/shirt-details/online/hienthi')
        .then(function(response) {
            $scope.shirts = response.data;  // Dữ liệu áo thun
            $scope.filteredShirts = $scope.shirts;  // Dữ liệu sau khi lọc
            console.log($scope.shirts);
            // Khởi tạo mặc định cho mỗi sản phẩm
            $scope.shirts.forEach(function(shirt) {
                shirt.selectedColorGroup = shirt.colorGroups[0]; // Mặc định chọn màu đầu tiên
                shirt.selectedVariant = shirt.colorGroups[0].variants[0]; // Mặc định chọn biến thể đầu tiên
            });
        })
        .catch(function(error) {
            console.log('Error:', error);
        });

    // Áp dụng bộ lọc
    $scope.applyFilters = function() {
        // Lọc theo giá
        $scope.filteredShirts = $scope.shirts.filter(function(shirt) {
            let priceValid = true;
            if ($scope.priceMin && shirt.selectedVariant.price < $scope.priceMin) {
                priceValid = false;
            }
            if ($scope.priceMax && shirt.selectedVariant.price > $scope.priceMax) {
                priceValid = false;
            }
            return priceValid;
        });

        // Lọc theo thương hiệu
        if ($scope.selectedBrand) {
            $scope.filteredShirts = $scope.filteredShirts.filter(function(shirt) {
                return shirt.codeBrand === $scope.selectedBrand.codeBrand;
            });
        }

        // Lọc theo danh mục
        if ($scope.selectedCategory) {
            $scope.filteredShirts = $scope.filteredShirts.filter(function(shirt) {
                return shirt.codeCategory === $scope.selectedCategory.codeCategory;
            });
        }

        // Lọc theo tên sản phẩm (tìm kiếm)
        if ($scope.searchText) {
            $scope.filteredShirts = $scope.filteredShirts.filter(function(shirt) {
                return shirt.nameShirt.toLowerCase().includes($scope.searchText.toLowerCase());
            });
        }

        // Sắp xếp theo giá
        if ($scope.sortOrder) {
            $scope.filteredShirts = $filter('orderBy')($scope.filteredShirts, 'selectedVariant.price', $scope.sortOrder === 'desc');
        }
    };

       $scope.viewDetails = function(shirt) {
          $scope.selectedShirt = angular.copy(shirt); // Tạo bản sao để tránh thay đổi trực tiếp
          var myModal = new bootstrap.Modal(document.getElementById('productModal'));
          
          myModal.show();
      };
        // Hàm xem chi tiết sản phẩm
        $scope.viewDetails2 = function(shirt) {
            // Lưu dữ liệu sản phẩm vào localStorage
            localStorage.setItem('selectedShirt', JSON.stringify(shirt));

            // Chuyển đến trang chi tiết sản phẩm
            window.location.href = '/cozastore-master/product-detail.html'; // Chuyển sang trang chi tiết
        };
    // Hàm thay đổi màu sắc
    $scope.changeColor = function(shirt, colorGroup) {
        shirt.selectedColorGroup = colorGroup;
        if (colorGroup.variants && colorGroup.variants.length > 0) {
            shirt.selectedVariant = colorGroup.variants[0]; // Chọn size đầu tiên làm mặc định
        } else {
            shirt.selectedVariant = null; // Không có size nào
        }
    };

   // Cập nhật thông tin khi người dùng thay đổi kích thước
$scope.changeSize = function(shirt, variant) {
    shirt.selectedVariant = variant;
};

// Lấy danh sách cartId khi đăng nhập
$http.get('http://localhost:8080/cart/getIDCart', {
        headers: {
            Authorization: "Bearer " + token,
        }
    })
    .then(function(response) {
        // Kiểm tra kỹ giá trị trả về
        console.log('Response:', response.data);
        if (response.data && response.data.length > 0) {
            $scope.cartId = response.data[0];
            console.log('Cart ID:', $scope.cartId);
        } else {
            console.log('Không có giỏ hàng.');
        }
    })
    .catch(function(error) {
        console.error('Error fetching Cart ID:', error);
    });

// Hàm thêm sản phẩm vào giỏ hàng
$scope.addToCart = function(shirtDetailId) {
    if (!shirtDetailId) {
        alert('Vui lòng chọn sản phẩm với kích thước và màu sắc.');
        return;
    }

    // Kiểm tra nếu cartId chưa được lấy
    if (!$scope.cartId) {
        alert('Không tìm thấy giỏ hàng.');
        return;
    }

    console.log('cartId trong hàm addToCart:', $scope.cartId);

    // Thực hiện yêu cầu POST để thêm vào giỏ hàng
    $http.post('http://localhost:8080/api/cart/add', {
        shirtDetailId: shirtDetailId,
        cartId: $scope.cartId // Sử dụng $scope.cartId
    })
    .then(function(response) {
        // Nếu không có lỗi, sản phẩm được thêm vào giỏ hàng
        alert('Sản phẩm đã có trong  giỏ hàng!');
    })
    .catch(function(error) {
        console.log('Error:', error);

        // Kiểm tra nếu lỗi là do sản phẩm đã tồn tại trong giỏ hàng
        if (error.status === 400 && error.data.message === "Sản phẩm đã tồn tại trong giỏ hàng.") {
            alert('Sản phẩm đã có trong giỏ hàng!');
        } else {
            alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        }
    });
};


    
}]);