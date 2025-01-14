angular
  .module("profileApp", [])
  .controller("ProfileController", [
    "$scope",
    "$http",
    "$location",
    "$window",
    function ($scope, $http, $location, $window) {
      // Cấu hình URL và token
      const API_BASE_URL = "http://localhost:8080/admin";
      const token = sessionStorage.getItem("jwtToken");
      const userCode = sessionStorage.getItem("userCode");

      // Kiểm tra đăng nhập
      if (!token || !userCode) {
        $location.path("/login");
        return;
      }

      // Khởi tạo biến
      $scope.user = {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        username: "",
        pass: "",
        avatarFile: null,
        status: [],
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
      $scope.errorMessage = "";
      $scope.successMessage = "";
      $scope.isSubmitting = false;
      $scope.statuses = [
        { value: 0, name: "Hoạt Động" },
        { value: 1, name: "Ngưng Hoạt Động" },
      ];

      // Biến cho chức năng đổi mật khẩu
      $scope.passwordData = {
        oldPassword: "",
        pass: "",
        confirmPassword: "",
      };

      // Validate form thông tin người dùng
      function validateForm() {
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!$scope.user.firstName || !$scope.user.lastName) {
          $scope.errorMessage = "Tên và họ không được để trống.";
          return false;
        }
        if (!$scope.user.phone || !$scope.user.phone.match(phoneRegex)) {
          $scope.errorMessage = "Số điện thoại không hợp lệ.";
          return false;
        }
        if (!$scope.user.email || !$scope.user.email.match(emailRegex)) {
          $scope.errorMessage = "Email không hợp lệ.";
          return false;
        }
        if ($scope.user.username.length < 3) {
          $scope.errorMessage = "Tên đăng nhập phải lớn hơn 3 ký tự.";
          return false;
        }

        $scope.errorMessage = "";
        return true;
      }

          // Hàm lấy quyền cao nhất
          function getHighestRole(scopes) {
            const roles = scopes ? scopes.split(" ") : [];
            const rolePriority = {
              ROLE_ADMIN: 1,
              ROLE_STAFF: 2,
              ROLE_USER: 3,
            };
        
            const validRoles = roles.filter((role) => rolePriority[role]);
            validRoles.sort((a, b) => rolePriority[a] - rolePriority[b]);
        
            return validRoles[0] || null;
          }
          
    
    $scope.isAdmin = function () {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        window.location.href = "/assets/account/login.html";
        return false;
      }
    
      const payload = JSON.parse(atob(token.split(".")[1]));
      const highestRole = getHighestRole(payload.scope);
    
      return highestRole === "ROLE_ADMIN";
    };
    

      // Gửi dữ liệu cập nhật thông tin người dùng
      function submitUpdate() {
        const formData = new FormData();
        formData.append("firstName", $scope.user.firstName);
        formData.append("lastName", $scope.user.lastName);
        formData.append("phone", $scope.user.phone);
        formData.append("email", $scope.user.email);
        formData.append("status", $scope.user.status);

        // Nếu có ảnh avatar, thêm vào form data
        if ($scope.user.avatarFile) {
          formData.append("avatarFile", $scope.user.avatarFile);
        }

        formData.append("provinceId", $scope.address.provinceId);
        formData.append("districtId", $scope.address.districtId);
        formData.append("wardId", $scope.address.wardId);
        formData.append("ward", $scope.address.ward);
        formData.append("province", $scope.address.province);
        formData.append("district", $scope.address.district);
        formData.append("detailAddress", $scope.address.detailAddress);



        // Gửi yêu cầu cập nhật
        $http
          .put(`${API_BASE_URL}/update/${userCode}`, formData, {
            transformRequest: angular.identity,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": undefined,
            },
          })
          .then(function (response) {
            console.log("Server response:", response);
            // Kiểm tra kết quả trả về từ API
            if (
              response.data &&
              response.data.code === 1000 &&
              response.data.result
            ) {
              // Nếu có kết quả và code là 1000, cập nhật thành công
              $scope.successMessage = "Cập nhật thành công!";
              $scope.goBack();
              $scope.errorMessage = "";
            } else {
              // Trường hợp có lỗi trong dữ liệu trả về
              $scope.errorMessage = "Cập nhật thất bại.";
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật tài khoản:", error);
            // Xử lý lỗi từ server
            $scope.errorMessage = error.data
              ? error.data.message
              : "Cập nhật thất bại.";
            $scope.successMessage = "";
          })
          .finally(function () {
            $scope.isSubmitting = false;
          });
      }

      // Cập nhật thông tin người dùng
      $scope.updateAccount = function () {
        if (!validateForm() || $scope.isSubmitting) return;

        $scope.isSubmitting = true;
        submitUpdate();
      };

      // Gọi API lấy thông tin người dùng
      function loadUserProfile() {
        $http({
          method: "GET",
          url: `${API_BASE_URL}/account/${userCode}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.data && response.data.result) {
              $scope.user = response.data.result;
              console.log("User profile loaded:", $scope.user);
            } else {
              $scope.errorMessage = "Không thể lấy thông tin người dùng.";
            }
          })
          .catch((error) => {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
          });
      }

      $scope.showChangePasswordForm = false;

      // Toggle sự hiển thị form Change Password
      $scope.toggleChangePassword = function () {
        $scope.showChangePasswordForm = !$scope.showChangePasswordForm;
      };

      // Thay đổi mật khẩu
      $scope.updatePassword = function () {
        // Kiểm tra mật khẩu cũ và mật khẩu mới
        if (
          !$scope.passwordData.oldPassword ||
          !$scope.passwordData.pass ||
          !$scope.passwordData.confirmPassword
        ) {
          $scope.errorMessage = "Vui lòng nhập đầy đủ thông tin mật khẩu.";
          return;
        }
    
        // Kiểm tra mật khẩu mới và mật khẩu xác nhận có khớp không
        if ($scope.passwordData.pass !== $scope.passwordData.confirmPassword) {
          $scope.errorMessage = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
          return;
        }
    
        // Tạo formData để gửi dữ liệu lên server
        var formData = new FormData();
        formData.append("oldPassword", $scope.passwordData.oldPassword);
        formData.append("pass", $scope.passwordData.pass);
    
        // Gửi yêu cầu cập nhật mật khẩu
        $http
          .put(`${API_BASE_URL}/update/${userCode}`, formData, {
            transformRequest: angular.identity,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": undefined, // Để trình duyệt tự động xác định content-type
            },
          })
          .then(function (response) {
            // Thông báo thành công
            $scope.successMessage = "Mật khẩu đã được cập nhật thành công!";
            $scope.toggleChangePassword(); // Ẩn form
            $scope.goBack();
          })
          .catch(function (error) {
            // Kiểm tra lỗi từ server (mật khẩu cũ không chính xác)
            if (error.data && error.data.errorCode === 'INVALID_OLD_PASSWORD') {
              $scope.errorMessage = "Mật khẩu cũ không chính xác.";
            } else {
              $scope.errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
            }
          });
    };
    
    $scope.isViewingUserAccount = function () {
      if (!$scope.user.role || $scope.user.role.length === 0) {
        return false; // Không có role thì không hiển thị input
      }
    
      const highestRole = getHighestRole($scope.user.role);
      return highestRole === "USER";
    };
    
    $scope.isUser = function () {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) return false;
    
      const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã JWT
      const roles = payload.scope ? payload.scope.split(" ") : [];
      return roles.includes("ROLE_USER") && roles.length === 1; // Chỉ có ROLE_USER
    };
    
      // Quay lại trang trước
      $scope.goBack = function () {
        $window.history.back();
      };

      // Xử lý roles
      $scope.getRoles = function (roles) {
        if (Array.isArray(roles)) {
          return roles.map((role) => role.name).join(", ");
        }
        return "No roles assigned";
      };
          // Token và shop_id để gửi trong header
    const TOKEN = "778ca0c9-ca77-11ef-8aa3-5afc7ca5b5c0"; // Thay bằng token của bạn
    const SHOP_ID = "5569909"; // Thay bằng shop_id của bạn
    const FROM_DISTRICT_ID = 3440; // ID Quận/Huyện người gửi

    $scope.loadUserAddress = function () {
      const token = sessionStorage.getItem("jwtToken");
      $http({
        method: "GET",
        url: `${API_BASE_URL}/address/${userCode}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          if (response.data && response.data.result) {
            $scope.address = response.data.result;
            console.log($scope.address);
            sessionStorage.setItem("provinceId", $scope.address.provinceId);
            sessionStorage.setItem("districtId", $scope.address.districtId);
            sessionStorage.setItem("wardId", $scope.address.wardId);
            // Gọi API để load danh sách quận/huyện và phường/xã dựa trên địa chỉ đã lưu
            if ($scope.address.provinceId) {
              fetchDistricts($scope.address.provinceId).then(() => {
                if ($scope.address.districtId) {
                  fetchWards($scope.address.districtId);
                }
              });
            }
          } else {
            console.error("Không thể lấy thông tin người dùng.");
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        });
    };
    $scope.loadUserAddress();

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
          
          const savedProvinceId = sessionStorage.getItem("provinceId");
          if (savedProvinceId) {
            $scope.address.provinceId = savedProvinceId;
          }
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

            const savedDistrictId = sessionStorage.getItem("districtId");
            if (savedDistrictId) {
              $scope.address.districtId = savedDistrictId;
            }
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

            const savedWardId = sessionStorage.getItem("wardId");
            if (savedWardId) {
              $scope.address.wardId = savedWardId;
            }
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


    // Điền danh sách quận/huyện vào select
    function populateDistrictSelect(districts) {
      const districtSelect = document.getElementById("districtSelect");
      districtSelect.innerHTML =
        '<option value="">-- Chọn quận/huyện --</option>'; // Reset danh sách
      districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district.DistrictID;
        option.textContent = district.DistrictName;
        districtSelect.appendChild(option);
      });
      districtSelect.disabled = false; // Mở khóa select quận/huyện
    }

    // Điền danh sách phường/xã vào select
    function populateWardSelect(wards) {
      const wardSelect = document.getElementById("wardSelect");
      wardSelect.innerHTML = '<option value="">-- Chọn phường/xã --</option>'; // Reset danh sách
      wards.forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.WardCode;
        option.textContent = ward.WardName;
        wardSelect.appendChild(option);
      });
      wardSelect.disabled = false; // Mở khóa select phường/xã
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

      // Gọi API khi khởi tạo controller
      loadUserProfile();
    },
  ])
  .directive("fileInput", function () {
    return {
      restrict: "A",
      link: function (scope, element) {
        element.on("change", function (event) {
          const file = event.target.files[0];
          scope.$apply(() => {
            scope.user.avatarFile = file;
          });
        });
      },
    };
  });
