angular.module("productApp", []).controller("ProductController", [
  "$scope",
  "$http",
  "$window",
  function ($scope, $http, $window) {
    $scope.shirtDetails = [];
    $scope.concat = [];
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
    $scope.canLoadMore = true; // Điều kiện để hiển thị nút Load More
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
            $scope.shirtDetails = response.data.result;
            // Giới hạn chỉ hiển thị 8 sản phẩm
            $scope.filteredShirtList = $scope.shirtDetails.slice(0, 8);

            // Gọi API để lấy tổng số sản phẩm
            $http
              .get("http://localhost:8080/homepage/countall")
              .then(function (response) {
                if (response.data && response.data.code === 1000) {
                  $scope.totalProducts = response.data.result;
                } else {
                  $scope.errorMessage = "Failed to get total products count.";
                }
              })
              .catch(function (error) {
                console.error("Error fetching product count:", error);
                $scope.errorMessage =
                  "An error occurred while fetching product count.";
              });
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

    $scope.fetchShirtsByFilter = function (
      min,
      max,
      color,
      brand,
      size,
      category
    ) {
      event.preventDefault();
      $scope.currentPage = 0;

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

      let url = "http://localhost:8080/homepage/filler?";

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

      // Thêm phân trang vào URL
      url += `&offset=${$scope.shirtsPerPage}&limit=${$scope.currentPage}&`;

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

            // Gọi API đếm số lượng sản phẩm với các bộ lọc
            $http
              .get("http://localhost:8080/homepage/countall", {
                params: {
                  min: $scope.selectedPrice.min,
                  max: $scope.selectedPrice.max,
                  color: $scope.selectedColor,
                  brand: $scope.selectedBrand,
                  size: $scope.selectedSize,
                  category: $scope.selectedCategory,
                },
              })
              .then(function (response) {
                if (response.data && response.data.code === 1000) {
                  $scope.totalProducts = response.data.result; // Số lượng sản phẩm
                } else {
                  $scope.errorMessage = "Failed to get total products count.";
                }
              })
              .catch(function (error) {
                console.error("Error fetching product count:", error);
                $scope.errorMessage =
                  "An error occurred while fetching product count.";
              });
          } else {
            $scope.errorMessage = "No shirts found for the specified filters.";
          }
        })
        .catch(function (error) {
          console.error("Error fetching shirts:", error);
          $scope.errorMessage = "An error occurred while fetching the shirts.";
        })
        .finally(function () {
          $scope.canLoadMore = true;
        });
    };

    $scope.loadMore = function () {
      // Tính toán số lượng sản phẩm đã tải
      let offset = $scope.shirtsPerPage * ($scope.currentPage + 1);

      if (offset >= $scope.totalProducts) {
        // Nếu đã tải hết sản phẩm, ẩn nút Load More
        $scope.canLoadMore = false;
        return;
      }

      // Cập nhật trang hiện tại để tải thêm sản phẩm
      $scope.currentPage++;

      // Gọi API để tải thêm sản phẩm
      let url = "http://localhost:8080/homepage/filler?";

      // Thêm bộ lọc vào URL
      if (
        $scope.selectedPrice.min !== null &&
        $scope.selectedPrice.max !== null
      ) {
        url += `min=${$scope.selectedPrice.min}&max=${$scope.selectedPrice.max}&`;
      }
      if ($scope.selectedColor) {
        url += `color=${$scope.selectedColor}&`;
      }
      if ($scope.selectedBrand) {
        url += `brand=${$scope.selectedBrand}&`;
      }
      if ($scope.selectedSize) {
        url += `size=${$scope.selectedSize}&`;
      }
      if ($scope.selectedCategory) {
        url += `category=${$scope.selectedCategory}&`;
      }

      // Thêm phân trang vào URL
      url += `offset=${$scope.shirtsPerPage * $scope.currentPage}&limit=${
        $scope.shirtsPerPage
      }`;

      // Gọi API
      $http
        .get(url)
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            // Thêm sản phẩm mới vào danh sách hiện tại
            let shirtDetails = response.data.result;

            // Lọc để loại bỏ sản phẩm trùng tên
            const uniqueShirts = [];
            const seenNames = new Set(
              $scope.shirtDetails.map((s) => s.nameShirt)
            );
            for (let shirt of shirtDetails) {
              if (!seenNames.has(shirt.nameShirt)) {
                uniqueShirts.push(shirt);
                seenNames.add(shirt.nameShirt);
              }
            }

            // Cập nhật danh sách chính
            $scope.shirtDetails = $scope.shirtDetails.concat(uniqueShirts);

            // Cập nhật danh sách hiển thị
            $scope.filteredShirtList = $scope.shirtDetails.slice(
              0,
              $scope.shirtsPerPage * ($scope.currentPage + 1)
            );

            // Kiểm tra nếu đã tải hết sản phẩm
            if ($scope.shirtDetails.length >= $scope.totalProducts) {
              $scope.canLoadMore = false;
            }
          } else {
            $scope.errorMessage = "Không thể tải thêm sản phẩm.";
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi tải thêm sản phẩm:", error);
          $scope.errorMessage = "Có lỗi xảy ra khi tải thêm sản phẩm.";
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

    $scope.bestSaler = function () {
      $http
        .get("http://localhost:8080/homepage/bestsaler")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.bestSaler = response.data.result;
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
      $scope.myProfile = null;
      window.location.href = "/assets/account/login.html";
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
        $scope.errorMessage = "Bạn cần đăng nhập trước.";
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

    $scope.fetchHomePageData();
    $scope.getMyProfile();
    $scope.getCategories();
    $scope.bestSaler();
    $scope.getColors();
    $scope.getBrands();
    $scope.getSizes();
  },
]);
