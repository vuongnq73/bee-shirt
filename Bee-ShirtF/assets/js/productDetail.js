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
$scope.addToCart = function(shirtDetailId) {
    if (!shirtDetailId) {
        alert('Vui lòng chọn sản phẩm với kích thước và màu sắc.');
        return;
    }

    // Kiểm tra token đăng nhập
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
        window.location.href = "/assets/account/login.html"; // Chuyển hướng tới trang đăng nhập
        return;
    }

    // Nếu cartId chưa được lấy, thực hiện lấy cartId từ API
    if (!$scope.cartId) {
        $http.get('http://localhost:8080/cart/getIDCart', {
            headers: {
                Authorization: "Bearer " + token,
            }
        })
        .then(function(response) {
            if (response.data && response.data.length > 0) {
                $scope.cartId = response.data[0];
                console.log('Cart ID:', $scope.cartId);

                // Tiếp tục thêm sản phẩm vào giỏ hàng
                addProductToCart($scope.cartId, shirtDetailId, token);
            } else {
                alert('Không tìm thấy giỏ hàng.');
            }
        })
        .catch(function(error) {
            console.error('Error fetching Cart ID:', error);
            alert('Có lỗi xảy ra khi lấy thông tin giỏ hàng.');
        });
    } else {
        localStorage.setItem('cartId', $scope.cartId);  // Lưu cartId vào localStorage
        console.log(cartId);
        // Nếu đã có cartId, thực hiện thêm sản phẩm vào giỏ hàng
        addProductToCart($scope.cartId, shirtDetailId, token);
    }
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
// Hàm phụ để thêm sản phẩm vào giỏ hàng
function addProductToCart(cartId, shirtDetailId, token) {
    $http.post('http://localhost:8080/api/cart/add', {
        shirtDetailId: shirtDetailId,
        cartId: cartId
    }, {
        headers: {
            Authorization: "Bearer " + token,
        }
    })
    .then(function(response) {
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    })
    .catch(function(error) {
        console.error('Error:', error);
    
        if (error.status === 400) {
            if (error.data && error.data.message === "Sản phẩm đã tồn tại trong giỏ hàng.") {
                alert('Sản phẩm đã có trong giỏ hàng. Bạn không cần phải thêm lại!');
            } else if (error.data && error.data.message === "Sản phẩm này không thể thêm vì trạng thái không hợp lệ.") {
                alert('Sản phẩm không thể thêm vào vì trạng thái không hợp lệ.');
            } else {
                alert('Lỗi: ' + (error.data && error.data.message ? error.data.message : 'Không xác định'));
            }
        } else if (error.status === 401) {
            alert('Phiên đăng nhập đã hết hạn. Bạn cần đăng nhập lại!');
            window.location.href = "/assets/account/login.html"; // Redirect to login page
        } else {
            alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
            console.error('Chi tiết lỗi:', error); // Log chi tiết hơn
        }
    });
}



}]);