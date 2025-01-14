angular
  .module("registerApp", [])
  .controller("registerController", function ($scope, $http) {
    $scope.user = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      username: "",
      pass: "",
      avatarFile: null, // File ảnh đại diện từ input
    };
    $scope.address = {
      provinceId: "",
      districtId: "",
      wardId: "",
      ward: "",
      district: "",
      province: "",
      detailAddress: "",
    };

    $scope.isSubmitting = false;

    $scope.errorMessage = "";
    $scope.successMessage = ""; // Biến để lưu thông báo thành công

    // Hàm xử lý việc đăng ký
    $scope.register = function () {
      if (!validateForm() || $scope.isSubmitting) return;

      $scope.isSubmitting = true;

      const formData = new FormData();
      for (const [key, value] of Object.entries($scope.user)) {
        if (value) formData.append(key, value);
      }

      for (const [key, value] of Object.entries($scope.address)) {
        if (value) formData.append(key, value);
      }

      console.log($scope.address);

      $http
        .post("http://localhost:8080/user/register", formData, {
          transformRequest: angular.identity,
          headers: { "Content-Type": undefined },
        })
        .then((response) => {
          $scope.successMessage = "Đăng ký thành công!";
          $scope.errorMessage = "";
          setTimeout(() => {
            window.location.href = "/assets/account/login.html";
          }, 2000);
        })
        .catch((error) => {
          $scope.errorMessage =
            error.data && error.data.message
              ? error.data.message
              : "Đăng ký thất bại.";
          $scope.successMessage = "";
        })
        .finally(() => {
          $scope.isSubmitting = false;
        });
    };

    // Hàm xác thực dữ liệu
    function validateForm() {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!$scope.user.firstName || !$scope.user.lastName) {
        $scope.errorMessage = "Tên và họ không được để trống.";
        return false;
      }
      if (!$scope.user.phone.match(phoneRegex)) {
        $scope.errorMessage = "Số điện thoại không hợp lệ.";
        return false;
      }
      if (!$scope.user.email.match(emailRegex)) {
        $scope.errorMessage = "Email không hợp lệ.";
        return false;
      }
      if ($scope.user.username.length < 3) {
        $scope.errorMessage = "Tên đăng nhập phải lớn hơn 3 ký tự.";
        return false;
      }
      if ($scope.user.pass.length < 5) {
        $scope.errorMessage = "Mật khẩu phải lớn hơn 5 ký tự.";
        return false;
      }

      $scope.errorMessage = ""; // Xóa thông báo lỗi
      return true; // Tất cả các điều kiện hợp lệ
    }
    // Token và shop_id để gửi trong header
    const TOKEN = "778ca0c9-ca77-11ef-8aa3-5afc7ca5b5c0"; // Thay bằng token của bạn
    const SHOP_ID = "5569909"; // Thay bằng shop_id của bạn
    const FROM_DISTRICT_ID = 3440; // ID Quận/Huyện người gửi

    // Hàm gọi API danh sách tỉnh/thành phố
    async function fetchProvinces() {
      try {
        const response = await fetch(
          "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: TOKEN,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          populateProvinceSelect(data.data);
          $scope.provinces = data.data || [];

        } else {
          console.error(
            "Lỗi khi lấy danh sách tỉnh/thành phố:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    }

    // Hàm gọi API danh sách quận/huyện
    async function fetchDistricts(provinceId) {
      try {
        const response = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: TOKEN,
            },
          }
        );
    
        if (response.ok) {
          const data = await response.json();
    
          // Kiểm tra xem dữ liệu có đúng định dạng không
          if (data && Array.isArray(data.data)) {
            $scope.districts = data.data;
          } else {
            console.error("Dữ liệu quận/huyện không đúng định dạng.");
          }
        } else {
          console.error("Lỗi khi lấy danh sách quận/huyện:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    }

    // Hàm gọi API danh sách phường/xã
    async function fetchWards(districtId) {
      try {
        const response = await fetch(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Token: TOKEN,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
    
          // Kiểm tra xem dữ liệu có đúng định dạng không
          if (data && Array.isArray(data.data)) {
            $scope.wards = data.data;
          } else {
            console.error("Dữ liệu phường/xã không đúng định dạng.");
          }
        } else {
          console.error("Lỗi khi lấy danh sách quận/huyện:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    }

    // Xử lý chọn địa chỉ
    $scope.onProvinceChange = function () {
      console.log($scope.address.provinceId); // Kiểm tra giá trị provinceId đã thay đổi

      // Tìm tỉnh từ danh sách provinces
      const selectedProvince = $scope.provinces.find(
        (province) =>
          parseInt(province.ProvinceID) === parseInt($scope.address.provinceId)
      );

      if (selectedProvince) {
        // Cập nhật cả tên và ID của tỉnh
        $scope.address.province = selectedProvince.ProvinceName;
        console.log("Selected province:", selectedProvince.ProvinceName);
        console.log("Province ID:", selectedProvince.ProvinceID); // Kiểm tra ID tỉnh
      } else {
        console.log("No province found");
      }

      // Reset các giá trị của quận và phường
      $scope.address.districtId = "";
      $scope.address.wardId = "";
      $scope.address.district = "";
      $scope.address.ward = "";

      $scope.districts = []; // Xóa danh sách quận đã chọn
      $scope.wards = []; // Xóa danh sách phường đã chọn

      // Lấy danh sách quận/huyện nếu có tỉnh được chọn
      if ($scope.address.provinceId) {
        fetchDistricts($scope.address.provinceId);
      }
    };

    $scope.onDistrictChange = function () {
      console.log($scope.address.districtId);

      const selectedDistrict = $scope.districts.find(
        (district) =>
          parseInt(district.DistrictID) === parseInt($scope.address.districtId)
      );

      if (selectedDistrict) {
        $scope.address.district = selectedDistrict.DistrictName;
        console.log("Selected district:", selectedDistrict.DistrictName);
        console.log("District ID:", selectedDistrict.DistrictID); // Kiểm tra ID quận
      }

      // Reset phường
      $scope.address.wardId = "";
      $scope.address.ward = "";

      $scope.wards = []; // Xóa danh sách phường đã chọn

      // Lấy danh sách phường nếu có quận được chọn
      if ($scope.address.districtId) {
        fetchWards($scope.address.districtId);
      }
    };

    $scope.onWardChange = function () {
      const selectedWard = $scope.wards.find(
        (ward) => ward.WardCode === $scope.address.wardId
      );

      if (selectedWard) {
        $scope.address.ward = selectedWard.WardName;
        console.log("Selected ward:", selectedWard.WardName);
        console.log("Ward ID:", selectedWard.WardCode); // Kiểm tra ID phường
      }
    };

    // Điền danh sách tỉnh/thành phố vào select
    function populateProvinceSelect(provinces) {
      const provinceSelect = document.getElementById("provinceSelect");
      provinces.forEach((province) => {
        const option = document.createElement("option");
        option.value = province.ProvinceID;
        option.textContent = province.ProvinceName;
        provinceSelect.appendChild(option);
      });
    }

    // Xử lý khi người dùng chọn tỉnh/thành phố
    document
      .getElementById("provinceSelect")
      .addEventListener("change", function () {
        const provinceId = this.value;
        if (provinceId) {
          fetchDistricts(provinceId);
        } else {
          const districtSelect = document.getElementById("districtSelect");
          districtSelect.innerHTML =
            '<option value="">-- Chọn quận/huyện --</option>';
          districtSelect.disabled = true;

          const wardSelect = document.getElementById("wardSelect");
          wardSelect.innerHTML =
            '<option value="">-- Chọn phường/xã --</option>';
          wardSelect.disabled = true;
        }
      });

    // Xử lý khi người dùng chọn quận/huyện
    document
      .getElementById("districtSelect")
      .addEventListener("change", function () {
        const districtId = this.value;
        if (districtId) {
          fetchWards(districtId);
        } else {
          const wardSelect = document.getElementById("wardSelect");
          wardSelect.innerHTML =
            '<option value="">-- Chọn phường/xã --</option>';
          wardSelect.disabled = true;
        }
      });

    // Tải danh sách tỉnh/thành phố khi trang được load
    window.addEventListener("DOMContentLoaded", fetchProvinces);
  })

  // Directive để xử lý input file
  .directive("fileInput", function () {
    return {
      restrict: "A",
      link: function (scope, element) {
        element.on("change", function (event) {
          var file = event.target.files[0];
          scope.$apply(function () {
            scope.user.avatarFile = file; // Lưu file vào scope
          });
        });
      },
    };
  });
