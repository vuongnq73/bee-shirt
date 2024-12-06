angular.module("homePageApp", []).controller("HomePageController", [
  "$scope",
  "$http",
  "$window",
  function ($scope, $http, $window) {
    $scope.shirtDetails = [];
    $scope.bestSaler = [];
    $scope.categories = [];
    $scope.filteredShirtList = [];
    $scope.myProfile = null;
    $scope.errorMessage = null;
    $scope.shirtDetails = []; // Danh sách sản phẩm hiển thị
    $scope.totalShirts = 0; // Tổng số sản phẩm
    $scope.loadedCount = 0; // Số sản phẩm đã tải
    $scope.itemsPerLoad = 8; // Số sản phẩm mỗi lần Load More
    $scope.allLoaded = false; // Biến để kiểm tra đã tải hết sản phẩm chưa

    // Lấy tổng số sản phẩm và tải sản phẩm ban đầu
    $scope.fetchHomePageData = function () {
      // Lấy tổng số sản phẩm
      $http
        .get("http://localhost:8080/homepage/countAll")
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.totalShirts = response.data.result;
          } else {
            $scope.errorMessage = "Không thể lấy tổng số sản phẩm.";
          }
        });

      // Tải sản phẩm ban đầu
      $scope.loadMore();
    };

    $scope.getAllProductByCategory = function (codeCategory) {
      const apiUrl = `http://localhost:8080/homepage/getallshirt/${codeCategory}`;

      $http
        .get(apiUrl)
        .then(function (response) {
          if (response.data && response.data.code === 1000) {
            $scope.allShirts = response.data.result; // Danh sách toàn bộ sản phẩm
            $scope.totalShirts = $scope.allShirts.length; // Tổng số lượng sản phẩm
            $scope.loadMore(); // Hiển thị các sản phẩm đầu tiên
          } else {
            console.error("Failed to load data.");
          }
        })
        .catch(function (error) {
          console.error("Error while fetching data:", error);
        });
    };

    // Hàm tải thêm sản phẩm
    $scope.loadMore = function () {
      if ($scope.loadedCount >= $scope.totalShirts) {
        $scope.allLoaded = true; // Đã tải hết sản phẩm
        return;
      }

      const apiUrl = `http://localhost:8080/homepage/getallshirt?offset=${$scope.loadedCount}&limit=${$scope.itemsPerLoad}`;
      $http.get(apiUrl).then(function (response) {
        if (response.data && response.data.code === 1000) {
          $scope.shirtDetails = $scope.shirtDetails.concat(
            response.data.result
          ); // Gộp dữ liệu mới
          $scope.loadedCount = $scope.shirtDetails.length; // Cập nhật số lượng đã tải
        } else {
          $scope.errorMessage = "Không thể tải thêm sản phẩm.";
        }
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
  },
]);
