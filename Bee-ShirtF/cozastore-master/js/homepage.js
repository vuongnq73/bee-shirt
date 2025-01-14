angular.module("homePageApp", []).controller("HomePageController", [
  "$scope",
  "$http",
  "$window",
  "$interval",
  function ($scope, $http, $window, $interval) {
    $scope.shirtDetails = [];
    $scope.bestSaler = [];
    $scope.categories = [];
    $scope.colors = [];
    $scope.brands = [];
    $scope.sizes = [];
    $scope.filteredShirtList = [];
    $scope.myProfile = null;
    $scope.errorMessage = null;
    $scope.loading = true;
    $scope.shirtsPerPage = 8; // Số lượng sản phẩm mỗi lần tải
    $scope.currentPage = 0; // Trang hiện tại
    $scope.selectedPrice = { min: null, max: null };
    $scope.selectedColor = null;
    $scope.selectedBrand = null;
    $scope.selectedSize = null;
    $scope.selectedCategory = null;


    $scope.fetchHomePageData = function () {
      event.preventDefault(); // Ngăn ngừa hành vi mặc định của thẻ <a>
      $http
        .get("http://localhost:8080/homepage/all")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            let shirtDetails = response.data.result;
    
            // Lọc để loại bỏ sản phẩm trùng tên
            const uniqueShirts = [];
            const seenNames = new Set();
            for (let shirt of shirtDetails) {
              if (!seenNames.has(shirt.nameShirt)) {
                uniqueShirts.push(shirt);
                seenNames.add(shirt.nameShirt);
              }
            }
    
            $scope.shirtDetails = uniqueShirts;
            console.log(shirtDetails);
            $scope.shirtDetails = response.data.result;
            // Giới hạn chỉ hiển thị 8 sản phẩm
            $scope.filteredShirtList = $scope.shirtDetails.slice(0, 8);
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching homepage data:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        })
        .finally(function () {
          $scope.loading = false;
        });
    };
    

    $scope.fetchShirtsByFilter = function (min, max, color, brand, size, category) {
      event.preventDefault();

      // Cập nhật bộ lọc giá hoặc màu
      if (min && max) {
        $scope.selectedPrice = { min: min, max: max };
      }
      if (color) {
        $scope.selectedColor = color;
      }
      if (brand) {
        $scope.selectedBrand = brand;
      }
      if (size) {
        $scope.selectedSize = size;
      }
      if (category) {
        $scope.selectedCategory = category;
      }

      let url = "http://localhost:8080/homepage/all?";

      // Thêm bộ lọc giá vào URL
      if (
        $scope.selectedPrice.min !== null &&
        $scope.selectedPrice.max !== null
      ) {
        url += `min=${$scope.selectedPrice.min}&max=${$scope.selectedPrice.max}&`;
      }

      // Thêm bộ lọc màu sắc vào URL
      if ($scope.selectedColor) {
        url += `color=${$scope.selectedColor}&`;
      }

      // Thêm bộ lọc hãng vào URL
      if ($scope.selectedBrand) {
        url += `brand=${$scope.selectedBrand}&`;
      }

      // Thêm bộ lọc size vào URL
      if ($scope.selectedSize) {
        url += `size=${$scope.selectedSize}&`;
      }

      // Thêm bộ lọc category vào URL
      if ($scope.selectedCategory) {
        url += `category=${$scope.selectedCategory}&`;
      }


      // Loại bỏ dấu & thừa nếu không có bộ lọc nào được chọn
      url = url.endsWith("&") ? url.slice(0, -1) : url;

      // Gọi API với URL đã chỉnh sửa
      $http
        .get(url)
        .then(function (response) {
          if (response.data && response.data.code === 1000) {

            $scope.shirtDetails = response.data.result;
            // Hiển thị sản phẩm đầu tiên
            $scope.filteredShirtList = $scope.shirtDetails.slice(
              0,
              $scope.shirtsPerPage
            );
          } else {
            $scope.errorMessage = "No shirts found for the specified filters.";
          }
        })
        .catch(function (error) {
          console.error("Error fetching shirts:", error);
          $scope.errorMessage = "An error occurred while fetching the shirts.";
        });
    };

    $scope.clearFilters = function () {
      $scope.selectedPrice = { min: null, max: null };
      $scope.selectedColor = null;
      $scope.selectedBrand = null;
      $scope.selectedSize = null;
      $scope.selectedCategory = null;
    
      // Gọi lại API với tất cả sản phẩm
      $scope.fetchShirtsByFilter(null, null, null, null, null, null);
    };

    // Hàm kiểm tra xem giá đã chọn có phải là giá này không
    $scope.isPriceSelected = function (min, max) {
      return $scope.selectedPrice.min == min && $scope.selectedPrice.max == max;
    };

    // Hàm kiểm tra xem màu đã chọn có phải là màu này không
    $scope.isColorSelected = function (color) {
      return $scope.selectedColor == color;
    };

     // Hàm kiểm tra xem hãng đã chọn có phải là hãng này không
     $scope.isBrandSelected = function (brand) {
      return $scope.selectedBrand == brand;
    };

    // Hàm kiểm tra xem size đã chọn có phải là size này không
    $scope.isSizeSelected = function (size) {
      return $scope.selectedSize == size;
    };

    // Hàm kiểm tra xem Category đã chọn có phải là Category này không
    $scope.isCategorySelected = function (category) {
      return $scope.selectedCategory == category;
    };

    $scope.getBrands = function () {
      $http
        .get("http://localhost:8080/homepage/getbranchs")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.brands = response.data.result;
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching gender data:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        });
    };

    $scope.getSizes = function () {
      $http
        .get("http://localhost:8080/homepage/getsizes")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.sizes = response.data.result;
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching gender data:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        });
    };

    $scope.getColors = function () {
      $http
        .get("http://localhost:8080/homepage/getcolors")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.colors = response.data.result;
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching gender data:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        });
    };

    $scope.getAllProductByCategory = function (codeCategory) {
      if (!codeCategory) {
        console.error("Category code is undefined!");
        $scope.errorMessage = "Please select a category.";
        return;
      }

      const apiUrl = `http://localhost:8080/homepage/getallshirt/${codeCategory}`;

      // Gọi API
      $http
        .get(apiUrl)
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            // Lưu tất cả sản phẩm vào $scope.shirtDetails
            $scope.shirtDetails = response.data.result;

            // Hiển thị 8 sản phẩm đầu tiên
            $scope.filteredShirtList = $scope.shirtDetails.slice(0, 8);

            // Kiểm tra xem có nhiều sản phẩm hơn không để hiển thị nút "Load More"
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching products by category:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        })
        .finally(function () {
          $scope.loading = false;
        });
    };

    $scope.loadBestSaler = function () {
      $http
        .get("http://localhost:8080/homepage/bestsaler")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
    
            $scope.bestSaler = response.data.result;
            $scope.updateVisibleShirts();
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching best-seller data:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        })
        .finally(function () {
          $scope.loading = false;
        });
    };
    
    
 // Chỉ số sản phẩm hiện tại
$scope.currentIndex = 0;

// Cập nhật danh sách các sản phẩm đang hiển thị
$scope.updateVisibleShirts = function() {
  const totalShirts = $scope.bestSaler.length;
  const nextIndex = $scope.currentIndex % totalShirts;
  $scope.visibleShirts = [];

  // Lấy 4 sản phẩm tiếp theo từ currentIndex
  for (let i = 0; i < 4; i++) {
    $scope.visibleShirts.push($scope.bestSaler[(nextIndex + i) % totalShirts]);
  }
};

// Hàm để di chuyển đến sản phẩm tiếp theo
$scope.nextProduct = function() {
  const totalShirts = $scope.bestSaler.length;
  $scope.currentIndex = ($scope.currentIndex + 1) % totalShirts;
  $scope.updateVisibleShirts();
};

// Hàm để quay lại sản phẩm trước đó
$scope.prevProduct = function() {
  const totalShirts = $scope.bestSaler.length;
  $scope.currentIndex = ($scope.currentIndex - 1 + totalShirts) % totalShirts;
  $scope.updateVisibleShirts();
};

// Tự động di chuyển sản phẩm mỗi 3 giây
$interval(function() {
  $scope.nextProduct();
}, 4000);

// Gọi hàm cập nhật sản phẩm ban đầu khi trang được tải



    $scope.getCategories = function () {
      $http
        .get("http://localhost:8080/homepage/category")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.categories = response.data.result;
          } else {
            $scope.errorMessage = "Failed to load data. Please try again.";
          }
        })
        .catch(function (error) {
          console.error("Error while fetching gender data:", error);
          $scope.errorMessage =
            "An error occurred. Please check the console for more details.";
        });
    };

    $scope.logout = function () {
      // Lấy token từ sessionStorage
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Không tìm thấy token, vui lòng đăng nhập lại.");
        window.location.href = "/assets/account/login.html";
        return;
      }

      // Tạo payload cho API logout
      const logoutRequest = {
        token: token, // Gửi token của người dùng hiện tại
      };

      // Gửi yêu cầu logout đến backend
      $http
        .post("http://localhost:8080/auth/logout", logoutRequest)
        .then(function (response) {
          // Xóa token khỏi sessionStorage
          sessionStorage.removeItem("jwtToken");

          // Chuyển hướng về trang đăng nhập
          alert("Đăng xuất thành công!");
          window.location.href = "/assets/account/login.html";
        })
        .catch(function (error) {
          // Xử lý lỗi khi không logout được
          console.error("Lỗi khi đăng xuất:", error);
          alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!");
        });
    };


    $scope.viewProfile = function () {
      const token = sessionStorage.getItem("jwtToken");

      if (!token || token.split(".").length !== 3) {
        console.log("Token không hợp lệ hoặc không tồn tại");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload["user Code"]) {
        const userCode = payload["user Code"];
        sessionStorage.setItem("userCode", userCode);
        console.log("userCode đã được lưu vào sessionStorage:", userCode);
      } else {
        console.log("Không tìm thấy userCode trong payload");
      }

      $window.location.href = "/assets/staff/Profile.html";
    };

    $scope.getMyProfile = function () {
      const token = sessionStorage.getItem("jwtToken");

      if (!token) {
        $scope.errorMessage = "Bạn hãy đăng nhập nếu đã có tài khoản !.";
        $scope.loading = false;
        return;
      }

      $http({
        method: "GET",
        url: "http://localhost:8080/admin/myProfile",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          if (response.data && response.data.result) {
            $scope.myProfile = response.data.result;
          } else {
            $scope.errorMessage = "Không thể lấy thông tin người dùng.";
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
        })
        .finally(function () {
          $scope.loading = false;
        });
    };

    $scope.goBack = function () {
      $window.history.back();
    };

    $scope.searchShirt = function () {
      if (!$scope.searchQuery) {
        // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
        $scope.filteredShirtList = $scope.shirtDetails;
      } else {
        // Nếu có từ khóa tìm kiếm, lọc danh sách
        $scope.filteredShirtList = $scope.shirtDetails.filter(function (shirt) {
          return (
            shirt.nameShirt
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            shirt.branch
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            shirt.size
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            String(shirt.price)
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) || // Chuyển price thành chuỗi
            shirt.color.toLowerCase().includes($scope.searchQuery.toLowerCase())
          );
        });
      }
    };
    $scope.errorMessage = "";
    $scope.email = "";
    $scope.verificationCode = "";
    $scope.isEmailInputVisible = true;  // Hiển thị ô nhập email ban đầu
    $scope.isCodeInputVisible = false;  // Ẩn ô nhập mã xác minh
    
    // Kiểm tra trạng thái đăng nhập và hiển thị modal
    $scope.checkLoginStatus = function() {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        // Nếu chưa đăng nhập, hiển thị modal
        var modal = new bootstrap.Modal(document.getElementById('emailModal'));
        modal.show();
      } else {
        // Nếu đã đăng nhập, chuyển hướng đến trang myOrder
        $window.location.href = "myOder.html";
      }
    };
    
    // Gửi mã xác minh đến email
    $scope.sendVerificationCode = function () {
      if (!$scope.email) {
        $scope.errorMessage = "Vui lòng nhập email.";
        return;
      }
    
      const data = { email: $scope.email };
    
      $http({
        method: 'POST',
        url: `http://localhost:8080/auth/send-verification-code`,
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.data.result) {
          alert("Mã xác nhận đã được gửi đến email của bạn.");
          // Chuyển sang chế độ nhập mã xác nhận
          $scope.isEmailInputVisible = false;
          $scope.isCodeInputVisible = true;
        } else {
          $scope.errorMessage = "Không thể gửi mã. Vui lòng thử lại.";
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gửi mã:", error);
        $scope.errorMessage = "Lỗi khi gửi mã. Vui lòng thử lại.";
      });
    };
    
    // Xác nhận mã xác minh và chuyển hướng đến trang myOrderByEmail
    $scope.verifyCode = function () {
      if (!$scope.verificationCode) {
          $scope.errorMessage = "Vui lòng nhập mã xác minh.";
          return;
      }
  
      const data = { email: $scope.email, verificationCode: $scope.verificationCode };
  
      $http({
          method: 'POST',
          url: `http://localhost:8080/auth/verify-code?email=${$scope.email}&token=${$scope.verificationCode}`,
          data: data,
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then((response) => {
          if (response.data.result) {
              alert("Mã xác minh thành công.");
              // Điều hướng đến trang danh sách đơn hàng khi xác nhận thành công
              $window.location.href = `myOderByEmail.html?email=${$scope.email}`;
          } else {
              $scope.errorMessage = "Mã xác minh không đúng. Vui lòng thử lại.";
          }
      })
      .catch((error) => {
          console.error("Lỗi khi xác minh mã:", error);
          $scope.errorMessage = "Lỗi khi xác minh mã. Vui lòng thử lại.";
      });
  };
  
    
    // Hàm ẩn modal khi nhấn "Hủy"
    $scope.closeModal = function () {
      const emailModal = document.getElementById('emailModal');
      const modalInstance = bootstrap.Modal.getInstance(emailModal);
      modalInstance.hide();
    };

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

    
    $scope.viewDetails = function(codeshirt) {
      // Tìm sản phẩm trong danh sách $scope.shirts theo codeshirt
      const selectedShirt = $scope.shirts.find(shirt => shirt.codeShirt === codeshirt);
      
      if (selectedShirt) {
          $scope.selectedShirt = angular.copy(selectedShirt); // Tạo bản sao để tránh thay đổi trực tiếp
          var myModal = new bootstrap.Modal(document.getElementById('productModal'));
          myModal.show(); // Hiển thị modal
      } else {
          console.error('Không tìm thấy sản phẩm với codeshirt:', codeshirt);
      }
  };
      $scope.viewDetails2 = function(codeshirt) {
        // Tìm sản phẩm theo codeshirt trong danh sách $scope.shirts
        const selectedShirt = $scope.shirts.find(shirt => shirt.codeShirt === codeshirt);
        
        console.log('Codeshirt:', codeshirt); // Kiểm tra codeshirt
    
        if (selectedShirt) {
            // Lưu sản phẩm vào localStorage
            localStorage.setItem('selectedShirt', JSON.stringify(selectedShirt));
            console.log('Sản phẩm đã lưu vào localStorage:', selectedShirt);
    
            // Chuyển đến trang chi tiết sản phẩm
            window.location.href = '/cozastore-master/product-detail.html';
        } else {
            console.error('Không tìm thấy sản phẩm với codeshirt:', codeshirt);
        }
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
      console.log($scope.cartId);
      // Nếu đã có cartId, thực hiện thêm sản phẩm vào giỏ hàng
      addProductToCart($scope.cartId, shirtDetailId, token);
  }
};

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

    $scope.fetchHomePageData();
    $scope.getMyProfile();
    $scope.getCategories();
    $scope.loadBestSaler();
    $scope.getColors();
    $scope.getBrands();
    $scope.getSizes();
  },
  
]);
