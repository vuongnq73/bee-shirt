angular.module("voucherApp", []).controller("voucherController1", [
  "$scope",
  "$http",
  "$timeout",
  function ($scope, $http, $timeout) {
    $scope.voucherList = [];
    $scope.voucherDetail = null; // Lưu trữ thông tin chi tiết cho một chứng từ đã chọn
    $scope.filteredVoucherList = [];

    $scope.errorMessage = ""; // Để lưu thông báo lỗi
    $scope.successMessage = "";
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.totalPages = 0;
    $scope.searchKeyword = ""; // Lưu từ khóa tìm kiếm

    $scope.getVouchers = function () {
      const token = sessionStorage.getItem("jwtToken");

      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/list?page=${$scope.currentPage}&size=${$scope.pageSize}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          const responseData = response.data;

          if (responseData && Array.isArray(responseData.content)) {
            $scope.voucherList = responseData.content.map((voucher) => {
              // Xác định trạng thái của voucher
              const currentDate = new Date();
              let status = 0; // Ngưng hoạt động

              const startDate = voucher.startdate
                ? new Date(voucher.startdate)
                : null;
              const endDate = voucher.enddate
                ? new Date(voucher.enddate)
                : null;

              if (startDate && endDate) {
                if (startDate > currentDate) {
                  status = 2; // Sắp hoạt động
                } else if (startDate <= currentDate && endDate >= currentDate) {
                  status = 1; // Hoạt động
                } else if (endDate < currentDate) {
                  status = 0; // Ngưng hoạt động
                }
              } else {
                console.warn(
                  "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ:",
                  voucher
                );
              }
              return {
                id: voucher.id,
                code_voucher: voucher.code_voucher,
                type_voucher: voucher.type_voucher,
                name_voucher: voucher.name_voucher,
                discount_value: voucher.discount_value,
                quantity: voucher.quantity,
                min_bill_value: voucher.min_bill_value,
                maximum_discount: voucher.maximum_discount,
                startdate: voucher.startdate,
                enddate: voucher.enddate,
                status_voucher: status, // Cập nhật trạng thái mới
                description_voucher: voucher.description_voucher,
                createby: voucher.createby,
                createAt: voucher.createAt,
                updateAt: voucher.updateAt,
              };
            });
            console.log($scope.voucherList);

            $scope.totalPages = responseData.totalPages || 1;
          } else {
            console.error("Dữ liệu không hợp lệ:", responseData);
            $scope.errorMessage =
              "Dữ liệu không hợp lệ: Không phải là một mảng.";
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy danh sách voucher:", error);
          $scope.errorMessage = "Không thể lấy danh sách voucher.";
        });
    };

    $scope.globalSearch = function () {
      const token = sessionStorage.getItem("jwtToken");
      const keyword = $scope.searchKeyword.trim(); // Loại bỏ khoảng trắng thừa

      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/search?keyword=${encodeURIComponent(
          keyword
        )}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          $scope.voucherList = response.data; // Gán kết quả tìm kiếm vào danh sách hiển thị
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm voucher:", error);
          $scope.errorMessage = "Không thể tìm kiếm voucher.";
        });
    };

    $scope.searchByDateRange = function () {
      const token = sessionStorage.getItem("jwtToken");
      // Lấy giá trị ngày bắt đầu và kết thúc từ người dùng
      const batdau = $scope.search.batdau ? new Date($scope.search.batdau) : "";
      const ketthuc = $scope.search.ketthuc
        ? new Date($scope.search.ketthuc)
        : "";

      // Kiểm tra xem ngày bắt đầu có lớn hơn ngày kết thúc không
      if (batdau && ketthuc && new Date(batdau) > new Date(ketthuc)) {
        $scope.errorMessage = "Ngày bắt đầu không được lớn hơn ngày kết thúc!";
        return;
      }

      // Chuyển đổi định dạng ngày theo yêu cầu của backend (ISO 8601: yyyy-MM-dd)

      // Chuyển đổi thành định dạng yyyy-MM-dd
      const formattedBatdau = batdau
        ? batdau.getFullYear() +
          "-" +
          ("0" + (batdau.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + batdau.getDate()).slice(-2)
        : "";
      const formattedKetthuc = ketthuc
        ? ketthuc.getFullYear() +
          "-" +
          ("0" + (ketthuc.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + ketthuc.getDate()).slice(-2)
        : "";

      console.log(formattedBatdau);

      console.log(formattedKetthuc);

      // Gửi yêu cầu tìm kiếm với ngày đã định dạng
      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/searchByDateRange?batdau=${formattedBatdau}&ketthuc=${formattedKetthuc}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          $scope.voucherList = response.data; // Cập nhật danh sách voucher
          $scope.errorMessage = ""; // Xóa thông báo lỗi nếu thành công
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm voucher:", error);
          $scope.errorMessage = "Không thể tìm kiếm voucher."; // Hiển thị lỗi khi không tìm được dữ liệu
        });
    };

    // cập nhật trạng thái hết hạn

    // // Gọi hàm này sau mỗi 5 phút để kiểm tra và cập nhật trạng thái voucher hết hạn
    // function updateExpiredVouchers() {
    //   $scope.updateExpiredVouchers();
    //   $timeout(updateExpiredVouchers, 5 * 60 * 1000); // Gọi lại sau 5 phút
    // }
    // updateExpiredVouchers();

    // // Gọi lần đầu tiên ngay sau khi tải trang
    // $timeout(updateExpiredVouchers, 5 * 60 * 1000);

    $scope.getVoucherDetail = function (id) {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      $http({
        method: "GET",
        url: `http://localhost:8080/voucher/detaill/${id}`,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          sessionStorage.setItem(
            "voucherDetail",
            JSON.stringify(response.data)
          );
          $scope.successMessage = "Voucher details loaded successfully.";
          window.location.href = "/assets/VoucherDetail.html";
        })
        .catch(function (error) {
          console.error("Error fetching voucher details:", error);
          $scope.errorMessage = "Unable to fetch voucher details.";
        });
    };

    $scope.formatDate = function (utcDate) {
      const localDate = new Date(utcDate); // Tạo đối tượng Date từ UTC
      return localDate.toLocaleString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
      }); // Đảm bảo múi giờ là Asia/Ho_Chi_Minh
    };

    window.onload = function () {
      const voucherDetail = JSON.parse(sessionStorage.getItem("voucherDetail"));

      if (voucherDetail) {
        // Gán giá trị vào form
        document.getElementById("id").value = voucherDetail.id;
        document.getElementById("code_voucher").value =
          voucherDetail.code_voucher;
        document.getElementById("type_voucher").value =
          voucherDetail.type_voucher;
        document.getElementById("name_voucher").value =
          voucherDetail.name_voucher;
        document.getElementById("discount_value").value =
          voucherDetail.discount_value;
        document.getElementById("quantity").value = voucherDetail.quantity;
        document.getElementById("min_bill_value").value =
          voucherDetail.min_bill_value;
        document.getElementById("maximum_discount").value =
          voucherDetail.maximum_discount;

        // Gán giá trị vào các input type="date"
        document.getElementById("startDate").value = voucherDetail.startdate;
        document.getElementById("endDate").value = voucherDetail.enddate;

        console.log(voucherDetail.enddate);

        console.log(voucherDetail.status_voucher);
        // Set the status
        if (voucherDetail.status_voucher === 1) {
          document.getElementById("statusActive").checked = true;
        } else if (voucherDetail.status_voucher === 0) {
          document.getElementById("statusInactive").checked = true;
        } else if (voucherDetail.status_voucher === 2) {
          document.getElementById("statusPending").checked = true;
        }
      } else {
        console.error("Voucher detail not found in sessionStorage.");
      }
    };

    $scope.addVoucher = function (newVoucher) {
      const token = sessionStorage.getItem("jwtToken");

      // Check if user is logged in
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      // Validate form fields
      if (!newVoucher.type_voucher) {
        $scope.errorMessage = "Type Voucher là bắt buộc!";
        return;
      }

      if (!newVoucher.discount_value) {
        $scope.errorMessage = "Discount Value là bắt buộc!";
        return;
      }

      if (
        newVoucher.type_voucher === "%" &&
        (newVoucher.discount_value < 1 || newVoucher.discount_value > 100)
      ) {
        $scope.errorMessage = "Phần trăm giảm giá phải từ 1 đến 100!";
        return;
      }

      if (
        newVoucher.type_voucher === "Số tiền" &&
        newVoucher.discount_value <= 0
      ) {
        $scope.errorMessage =
          "Giá trị giảm giá phải lớn hơn 0 khi chọn loại 'Số tiền'!";
        return;
      }

      if ($scope.newVoucher.type_voucher === "Số tiền") {
        $scope.newVoucher.maximum_discount = null; // Reset maximum_discount
      }

      if (!newVoucher.name_voucher) {
        $scope.errorMessage = "Tên Voucher là bắt buộc!";
        return;
      }
      if (!newVoucher.quantity || newVoucher.quantity <= 0) {
        $scope.errorMessage = "Số lượng phải lớn hơn 0!";
        return;
      }
      if (!newVoucher.min_bill_value || newVoucher.min_bill_value <= 0) {
        $scope.errorMessage = "Giá trị hóa đơn tối thiểu phải lớn hơn 0!";
        return;
      }
      if (newVoucher.type_voucher === "%") {
        if (!newVoucher.maximum_discount || newVoucher.maximum_discount <= 0) {
          $scope.errorMessage = "Giảm giá tối đa phải lớn hơn 0!";
          return;
        }
      }

      // Chuyển đổi startdate và enddate thành chuỗi ISO cho cả ngày và giờ
      const now = new Date().toISOString();

      const startDateTime = new Date(newVoucher.startdate).toISOString();
      const endDateTime = new Date(newVoucher.enddate).toISOString();
      // Check if startDateTime is in the past
      if (startDateTime < now) {
        $scope.errorMessage =
          "Ngày giờ bắt đầu không được sớm hơn ngày giờ hiện tại!";
        return;
      }

      // Check if endDateTime is earlier than startDateTime
      if (endDateTime < startDateTime) {
        $scope.errorMessage =
          "Ngày giờ kết thúc không được sớm hơn ngày giờ bắt đầu!";
        return;
      }

      // Optional description check
      newVoucher.description_voucher = newVoucher.description_voucher || ""; // If empty, set it as an empty string

      // Send data to server
      $http({
        method: "POST",
        url: "http://localhost:8080/voucher/add",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          // code_voucher: newVoucher.code_voucher,
          type_voucher: newVoucher.type_voucher,
          name_voucher: newVoucher.name_voucher,
          discount_value: newVoucher.discount_value,
          quantity: newVoucher.quantity,
          min_bill_value: newVoucher.min_bill_value,
          maximum_discount: newVoucher.maximum_discount,
          startdate: newVoucher.startdate,
          enddate: newVoucher.enddate,
          description_voucher: newVoucher.description_voucher,
        },
      })
        .then(function (response) {
          $scope.successMessage = "Voucher đã được thêm thành công!";
          // Refresh the list of vouchers after successful addition

          $scope.voucherList.unshift(response.data); // Dùng unshift để thêm vào đầu mảng

          // $scope.getVouchers();
          // Optionally redirect to the voucher list page
          window.location.href = "/assets/Voucher.html";
        })
        .catch(function (error) {
          console.error("Lỗi khi thêm voucher:", error);
          $scope.errorMessage = "Không thể thêm voucher.";
        });
    };

    $scope.deleteVoucher = function (voucherId) {
      const token = sessionStorage.getItem("jwtToken");

      // Kiểm tra nếu người dùng chưa đăng nhập
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      // Xác nhận người dùng muốn xóa voucher
      if (!confirm("Bạn có chắc chắn muốn xóa voucher này?")) {
        return;
      }

      // Hiển thị thông báo đang xử lý và vô hiệu hóa nút xóa
      $scope.isDeleting = true;
      $scope.deleteButtonText = "Đang xóa...";

      // Gửi yêu cầu xóa voucher tới server
      $http({
        method: "DELETE",
        url: "http://localhost:8080/voucher/delete/" + voucherId,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(function (response) {
          if (response.status === 200) {
            $scope.successMessage = response.data.message;
            $scope.errorMessage = "";
            $scope.getVouchers(); // Cập nhật lại danh sách voucher
          } else {
            $scope.errorMessage = "Có lỗi xảy ra khi xóa voucher!";
          }

          $scope.isDeleting = false; // Kích hoạt lại nút sau khi hoàn tất
        })
        .catch(function (error) {
          console.error("Error deleting voucher:", error);
          console.log(error.response); // In ra thông tin phản hồi nếu có
          $scope.errorMessage = "Xóa thất bại.";
          $scope.successMessage = "";
          $scope.isDeleting = false; // Kích hoạt lại nút sau khi gặp lỗi
        });
    };

    $scope.updateVoucher = function (newVoucher, id) {
      const token = sessionStorage.getItem("jwtToken");

      // Check if user is logged in
      if (!token) {
        $scope.errorMessage = "Bạn chưa đăng nhập!";
        return;
      }
      $scope.errorMessage = "";
      $scope.successMessage = "";

      if (!newVoucher.quantity || newVoucher.quantity <= 0) {
        $scope.errorMessage = "Số lượng phải lớn hơn 0!";
        return;
      }

      // Chuyển đổi startdate và enddate thành chuỗi ISO cho cả ngày và giờ
      const now = new Date().toISOString();

      const startDateTime = new Date(newVoucher.startdate).toISOString();
      const endDateTime = new Date(newVoucher.enddate).toISOString();
      // Check if startDateTime is in the past
      if (startDateTime < now) {
        $scope.errorMessage =
          "Ngày giờ bắt đầu không được sớm hơn ngày giờ hiện tại!";
        return;
      }

      // Check if endDateTime is earlier than startDateTime
      if (endDateTime < startDateTime) {
        $scope.errorMessage =
          "Ngày giờ kết thúc không được sớm hơn ngày giờ bắt đầu!";
        return;
      }

      // Optional description check
      newVoucher.description_voucher = newVoucher.description_voucher || ""; // If empty, set it as an empty string

      // Send data to server
      $http({
        method: "PUT",
        url: `http://localhost:8080/voucher/update/${id}`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          code_voucher: newVoucher.code_voucher,
          type_voucher: newVoucher.type_voucher,
          name_voucher: newVoucher.name_voucher,
          discount_value: newVoucher.discount_value,
          quantity: newVoucher.quantity,
          min_bill_value: newVoucher.min_bill_value,
          maximum_discount: newVoucher.maximum_discount,
          startdate: newVoucher.startdate,
          enddate: newVoucher.enddate,
          description_voucher: newVoucher.description_voucher,
        },
      })
        .then(function (response) {
          $scope.successMessage = "Voucher đã được thêm thành công!";
          // Refresh the list of vouchers after successful addition

          $scope.voucherList.unshift(response.data); // Dùng unshift để thêm vào đầu mảng

          // $scope.getVouchers();
          // Optionally redirect to the voucher list page
          window.location.href = "/assets/Voucher.html";
        })
        .catch(function (error) {
          console.error("Lỗi khi thêm voucher:", error);
          $scope.errorMessage = "Không thể thêm voucher.";
        });
    };

    // Hàm xem profile
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

    $scope.deleteAccount = function (code) {
      if (confirm("Are you sure you want to delete this account?")) {
        const token = sessionStorage.getItem("jwtToken");

        // Khởi tạo biến trạng thái để tắt nút khi đang xóa
        $scope.isDeleting = true;

        $http({
          method: "DELETE",
          url: `http://localhost:8080/admin/delete/${code}`, // URL API cho chức năng xóa
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then(function (response) {
            $scope.successMessage = "Account deleted successfully!";
            $scope.errorMessage = ""; // Xóa thông báo lỗi (nếu có)
            $scope.getCustomers(); // Cập nhật lại danh sách nhân viên sau khi xóa
            $scope.isDeleting = false; // Kích hoạt lại nút sau khi hoàn tất

            // Tự động ẩn thông báo sau 3 giây
            setTimeout(function () {
              $scope.successMessage = "";
              $scope.$apply();
            }, 3000);
          })
          .catch(function (error) {
            console.error("Error deleting account:", error);
            $scope.errorMessage = "Failed to delete account.";
            $scope.successMessage = ""; // Xóa thông báo thành công (nếu có)
            $scope.isDeleting = false; // Kích hoạt lại nút sau khi gặp lỗi
          });
      }
    };

    // Hàm tìm kiếm
    $scope.searchCustomer = function () {
      if (!$scope.searchQuery) {
        $scope.filteredCustomerList = $scope.customerList;
      } else {
        $scope.filteredCustomerList = $scope.customerList.filter(function (
          customer
        ) {
          return (
            customer.code
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            customer.username
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            customer.email
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase()) ||
            customer.phone.includes($scope.searchQuery) ||
            customer.address
              .toLowerCase()
              .includes($scope.searchQuery.toLowerCase())
          );
        });
      }
    };

    //Lấy thông tin của tài khoản đang đăng nhập
    $scope.getMyProfile = function () {
      const token = sessionStorage.getItem("jwtToken");
      $http({
        method: "GET",
        url: `http://localhost:8080/admin/myProfile`, // Đảm bảo URL đúng
        headers: {
          Authorization: "Bearer " + token, // Kiểm tra xem token có hợp lệ không
        },
      })
        .then(function (response) {
          console.log("Response:", response); // Log toàn bộ response để kiểm tra

          if (response.data && response.data.result) {
            $scope.myProfile = response.data.result;
            console.log("My Profile:", $scope.myProfile); // Kiểm tra giá trị gán vào myProfile
          } else {
            $scope.errorMessage = "Không thể lấy thông tin người dùng.";
            console.log($scope.errorMessage);
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          $scope.errorMessage = "Có lỗi xảy ra khi lấy dữ liệu.";
        })
        .finally(function () {
          $scope.loading = false; // Tắt trạng thái loading sau khi nhận được phản hồi
        });
    };
    // Hàm xem profile
    $scope.goToUpdateProfile = function (userCode) {
      // Lưu thông tin người dùng vào sessionStorage để chuyển trang
      sessionStorage.setItem("userCode", userCode);

      // Sử dụng $location để điều hướng trong AngularJS
      window.location.href = "/assets/staff/Profile.html";
    };

    $scope.getMyProfile();

    $scope.getVouchers();
  },
]);
