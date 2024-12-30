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
    $scope.currentPage = 1; // Trang hiện tại
    $scope.selectedPrice = { min: null, max: null };
    $scope.selectedColor = null;
    $scope.selectedBrand = null;
    $scope.selectedSize = null;
    $scope.selectedCategory = null;

    $scope.fetchHomePageData = function () {
      event.preventDefault(); // Ngăn ngừa hành vi mặc định của thẻ <a>
      $http
        .get("http://localhost:8080/homepage/getallshirt")
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
    
            $scope.bestSaler = uniqueShirts;
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
    

    $scope.fetchHomePageData();
    $scope.getMyProfile();
    $scope.getCategories();
    $scope.loadBestSaler();
    $scope.getColors();
    $scope.getBrands();
    $scope.getSizes();
  },
]);
